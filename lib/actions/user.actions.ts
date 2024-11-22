'use server';

import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { utapi, utFile } from '../uploadthing/utapi';


const signUpData = zod.object({
  name: zod.string().min(1, 'Name is required!'),
  email: zod.string().min(1, 'Email is required!').email('Invalid email!'),
  password: zod.string().min(1, 'Password is required!').min(6, 'Password should have 6 characters at least'),
  confirmPassword: zod.string().min(1, 'Password is required!').min(6, 'Password should have 6 characters at least'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});


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
  const imageToUpload = new utFile([imageBlob!], `${name}-avatar.png`, { customId: `${name}-avatar` })

  const image = imageToUpload && imageToUpload.size > 0 ? (await utapi.uploadFiles([imageToUpload]))[0].data?.url : '';

  console.log('REGISTER: Image url', image)
};  