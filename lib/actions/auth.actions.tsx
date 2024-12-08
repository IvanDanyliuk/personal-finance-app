'use server';

import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { z as zod } from 'zod';
import { signIn, signOut } from '@/auth';
import { utapi } from '../uploadthing/utapi';
import { db } from '@/db';
import { signInSchema, signUpSchema } from '../types/form-schemas/auth';
import { ActionStatus } from '../types/common.types';


export const transformZodErrors = (error: zod.ZodError) => {
  return error.issues.map((issue) => ({
    path: issue.path.join('. '),
    message: issue.message,
  }));
};


export const signInWithProvider = async (provider: string) => {
  await signIn(provider, { redirectTo: '/' });
  revalidatePath('/');
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
  revalidatePath('/');
};



export const signin = async (formData: FormData) => {
  try {
    // const email = formData.get('email') as string;
    // const password = formData.get('password') as string;
    // const { email, password } = formData;

    const validatedFields = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // const validatedFields = signInData.safeParse({
    //   email, password
    // });
  
    if(!validatedFields.success) {
      return {
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingUser = await db.user.findUnique({ where: { email: validatedFields.data.email } });
    const existingPassword = existingUser?.password || null;

    if(existingUser && existingPassword) {
      await signIn('credentials', {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        redirect: false
        // redirectTo: '/'
      });

      return {
        status: ActionStatus.Success,
        error: null
      };
    } else {
      if(existingUser) {
        const userAccount = await db.account.findUnique({ where: { userId: existingUser!.id! } });
      
        if(userAccount) {
          return {
            status: ActionStatus.Failed,
            error: userAccount.provider === 'google' ? 
              'errors.auth.fieldsValidation.wrongProviderGoogle' : 
              userAccount.provider === 'facebook' ? 
                'errors.auth.fieldsValidation.wrongProviderFacebook' : 
                'errors.auth.fieldsValidation.wrongCredentials'
          };
        }

        return {
          status: ActionStatus.Failed,
          error: 'errors.auth.fieldsValidation.accountNotExist'
        };
      } else {
        return {
          status: ActionStatus.Failed,
          error: 'errors.auth.fieldsValidation.accountNotExist'
        };
      }
    }
  } catch (error: any) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return {
            status: ActionStatus.Failed,
            error: 'errors.auth.fieldsValidation.invalidCredentials'
          };
        default:
          return {
            status: ActionStatus.Failed,
            error: 'errors.auth.fieldsValidation.invalidCredentials'
          };
      }
    }

    throw error;
  };

  // revalidatePath('/');
};

export const signup = async (formData: FormData) => {
  try {
    // const name = formData.get('name') as string;
    // const email = formData.get('email') as string;
    // const password = formData.get('password') as string;
    // const confirmPassword = formData.get('confirmPassword') as string;
    // const rawImage = formData.get('image') as string;

    const validatedFields = signUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      image: formData.get('image'),
    });

    // const validatedFields = signUpData.safeParse({
    //   name, email, password, confirmPassword
    // });

    if(!validatedFields.success) {
      return {
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    console.log('SIGN IN: VALIDATED FIELDS', validatedFields)

    const existingUser = await db.user.findUnique({ where: { email: validatedFields.data.email } });

    if(existingUser) {
      return {
        status: ActionStatus.Failed,
        error: 'errors.auth.fieldsValidation.userAlreadyExists'
      };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);
    
    const imageFile = validatedFields.data.image ? await fetch(validatedFields.data.image) : '';
    const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    const imageToUpload = new File([imageBlob!], `${validatedFields.data.name}-avatar`);
    const image = imageToUpload && imageToUpload.size > 0 ? 
      (await utapi.uploadFiles([imageToUpload]))[0].data?.url : 
      '';

    await db.user.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: hashedPassword,
        image,
        role: 'USER',
        weekStartDay: 1,
        currency: 'usd',
        language: 'en',
      }
    });

    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false
      // redirectTo: '/'
    });

    return {
      status: ActionStatus.Success,
      error: null
    };
  } catch (error: any) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return {
            status: ActionStatus.Failed,
            error: 'auth.fieldsValidation.invalidCredentials'
          };
        default:
          return {
            status: ActionStatus.Failed,
            error: 'auth.fieldsValidation.wrongCredentials'
          };
      }
    }

    throw error;
  }

  revalidatePath('/');
};  