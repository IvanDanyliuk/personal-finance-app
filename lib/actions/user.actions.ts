'use server';

import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { utapi, utFile } from '../uploadthing/utapi';
import { db } from '@/db';


export const getUser = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};