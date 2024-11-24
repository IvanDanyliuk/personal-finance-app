'use server';

import { revalidatePath } from 'next/cache';
import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/auth';
import { utapi, utFile } from '../uploadthing/utapi';
import { db } from '@/db';
import { AuthError } from 'next-auth';


const signUpData = zod.object({
  name: zod.string().min(1, 'Name is required!'),
  email: zod.string().min(1, 'Email is required!').email('Invalid email!'),
  password: zod.string().min(1, 'Password is required!').min(6, 'Password should have 6 characters at least'),
  confirmPassword: zod.string().min(1, 'Password confirmation is required!').min(6, 'Password should have 6 characters at least'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

const signInData = zod.object({
  email: zod.string().min(1, 'Email is required!').email('Invalid email!'),
  password: zod.string().min(1, 'Password is required!').min(6, 'Password should have 6 characters at least'),
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
            error: `You created your account using your ${userAccount.provider} account. Sign in using your ${userAccount.provider} account and set the password via Settings`
          };
        }
      } else {
        return {
          error: 'Account does not exist. There are no accounts with such email'
        };
      }
    }
  } catch (error: any) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid credentials'
          };
        default:
          return {
            error: error.cause?.err?.message
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
        error: 'The user with such email already exists'
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imageFile = rawImage ? await fetch(rawImage) : '';
    const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    const imageToUpload = new utFile([imageBlob!], `${name}-avatar`, { customId: `${name}-avatar` });
    const image = imageToUpload && imageToUpload.size > 0 ? (await utapi.uploadFiles([imageToUpload]))[0].data?.url : '';

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
        role: 'USER',
      }
    });

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/'
    })
  } catch (error: any) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid credentials'
          };
        default:
          return {
            error: 'Something went wrong'
          };
      }
    }

    throw error;
  }

  revalidatePath('/');
};  