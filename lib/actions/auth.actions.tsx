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
  confirmPassword: zod.string().min(1, 'Password is required!').min(6, 'Password should have 6 characters at least'),
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

    console.log('SIGN IN: Data', { email, password })

    const validatedFields = signInData.safeParse({
      email, password
    });
  
    if(!validatedFields.success) {
      console.log('SIGN IN: Validation error')
      return {
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    const existingPassword = existingUser?.password || null;

    if(existingUser && existingPassword) {
      console.log('SIGN IN ERROR', existingPassword)
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/'
      });
    } else {
      if(existingUser) {
        const userAccount = await db.account.findUnique({ where: { userId: existingUser!.id! } });
      
        if(userAccount) {
          console.log('SIGN IN ERROR: User account exists')
          return {
            error: `You have signed up using your ${userAccount.provider} account. Sign in using your ${userAccount.provider} account and set the password via Settings`
          };
        }
      } else {
        console.log('SIGN IN ERROR: User account does not exist')
        return {
          error: 'Account does not exist. There are np accounts with such email'
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
            error: 'Something went wrong'
          };
      }
    }

    throw error;
  };

  revalidatePath('/');
};

export const signup = async (prevState: any, formData: FormData) => {
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
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // TODO: Check if the user exist

  const hashedPassword = await bcrypt.hash(password, 10);

  const imageFile = rawImage ? await fetch(rawImage) : '';
  const imageBlob = imageFile ? await imageFile.blob() : new Blob();
  const imageToUpload = new utFile([imageBlob!], `${name}-avatar.png`, { customId: `${name}-avatar` });
  const image = imageToUpload && imageToUpload.size > 0 ? (await utapi.uploadFiles([imageToUpload]))[0].data?.url : '';

  console.log('REGISTER: Image url', image)
};  