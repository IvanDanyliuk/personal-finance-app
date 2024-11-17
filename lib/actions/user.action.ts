'use server';

import { signIn } from "@/auth";

export const signInWithProvider = async (provider: string) => {
  await signIn(provider);
};