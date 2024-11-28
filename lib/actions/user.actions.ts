'use server';

import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { utapi, utFile } from '../uploadthing/utapi';
import { db } from '@/db';


export const getUser = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const updateUserPhoto = async (prevState: any, formData: FormData) => {
  const rawNewImage = formData.get('image') as string;

  console.log('UPDATE USER PHOTO', rawNewImage);
};