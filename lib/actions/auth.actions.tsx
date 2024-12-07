'use server';

import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';
import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/auth';
import { utapi } from '../uploadthing/utapi';
import { db } from '@/db';


const signUpData = zod.object({
  name: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredName'),
  email: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredEmail').email('Auth.errors.auth.fieldsValidation.invalidEmail'),
  password: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidPassword'),
  confirmPassword: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredConfirmPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidConfirmPassword'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Auth.errors.auth.fieldsValidation.passwordNotMatch',
});

const signInData = zod.object({
  email: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredEmail').email('Auth.errors.auth.fieldsValidation.invalidEmail'),
  password: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidPassword'),
});


export const signInWithProvider = async (provider: string) => {
  await signIn(provider, { redirectTo: '/' });
  revalidatePath('/');
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
  revalidatePath('/');
};

export const signin = async (prevState: any, formData: FormData) => {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validatedFields = signInData.safeParse({
      email, password
    });
  
    if(!validatedFields.success) {
      return {
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    const existingPassword = existingUser?.password || null;

    if(existingUser && existingPassword) {
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/'
      });
    } else {
      if(existingUser) {
        const userAccount = await db.account.findUnique({ where: { userId: existingUser!.id! } });
      
        if(userAccount) {
          return {
            error: userAccount.provider === 'google' ? 
              'errors.auth.fieldsValidation.wrongProviderGoogle' : 
              userAccount.provider === 'facebook' ? 
                'errors.auth.fieldsValidation.wrongProviderFacebook' : 
                'errors.auth.fieldsValidation.wrongCredentials'
          };
        }
      } else {
        return {
          error: 'errors.auth.fieldsValidation.accountNotExist'
        };
      }
    }
  } catch (error: any) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return {
            error: 'errors.auth.fieldsValidation.invalidCredentials'
          };
        default:
          return {
            error: 'errors.auth.fieldsValidation.invalidCredentials'
          };
      }
    }

    throw error;
  };

  revalidatePath('/');
};

export const signup = async (prevState: any, formData: FormData) => {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const rawImage = formData.get('image') as string;

    const validatedFields = signUpData.safeParse({
      name, email, password, confirmPassword
    });

    if(!validatedFields.success) {
      return {
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingUser = await db.user.findUnique({ where: { email } });

    if(existingUser) {
      return {
        error: 'errors.auth.fieldsValidation.userAlreadyExists'
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const imageFile = rawImage ? await fetch(rawImage) : '';
    const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    const imageToUpload = new File([imageBlob!], `${name}-avatar`);
    const image = imageToUpload && imageToUpload.size > 0 ? 
      (await utapi.uploadFiles([imageToUpload]))[0].data?.url : 
      '';

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
        role: 'USER',
        weekStartDay: 1,
        currency: 'usd',
        language: 'en',
      }
    });

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/'
    });
  } catch (error: any) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return {
            error: 'auth.fieldsValidation.invalidCredentials'
          };
        default:
          return {
            error: 'auth.fieldsValidation.wrongCredentials'
          };
      }
    }

    throw error;
  }

  revalidatePath('/');
};  