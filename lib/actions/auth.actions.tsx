'use server';

import { revalidatePath } from 'next/cache';
import { signIn, signOut } from '@/auth';


export const signInWithProvider = async (provider: string) => {
  await signIn(provider, { redirectTo: '/' });
  revalidatePath('/');
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
  revalidatePath('/');
};

