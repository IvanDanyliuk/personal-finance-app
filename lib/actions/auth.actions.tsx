'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
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
    const validatedFields = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
  
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
};

export const signup = async (formData: FormData) => {
  try {
    const validatedFields = signUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      image: formData.get('image') || null,
    });

    if(!validatedFields.success) {
      return {
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingUser = await db.user.findUnique({ where: { email: validatedFields.data.email } });

    if(existingUser) {
      return {
        status: ActionStatus.Failed,
        error: 'errors.auth.fieldsValidation.userAlreadyExists'
      };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);
    
    const image = validatedFields.data.image && typeof validatedFields.data.image === 'object' && 'size' in validatedFields.data.image
      ? (await utapi.uploadFiles([validatedFields.data.image]))[0].data?.url
      : '';

    await db.user.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: hashedPassword,
        image,
        role: 'USER',
        weekStartDay: '1',
        currency: 'usd',
        language: 'en',
      }
    });

    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false
    });

    cookies().set('language', 'en')

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
};  