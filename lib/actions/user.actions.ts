'use server';

import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { utapi, utFile } from '../uploadthing/utapi';
import { db } from '@/db';
import { ActionStatus } from '../types/common.types';
import { revalidatePath } from 'next/cache';
import { auth, unstable_update } from '@/auth';


export const getUser = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const updateUserPhoto = async (data: any, prevState: any, formData: FormData) => {  
  try {
    const rawNewImage = formData.get('image') as string;

    const imageFile = rawNewImage ? await fetch(rawNewImage) : '';
    const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    const imageToUpload = new File([imageBlob!], `${data.userId}-avatar`)
    const image = imageToUpload && imageToUpload.size > 0 ? (await utapi.uploadFiles([imageToUpload]))[0].data?.url : '';

    const session = await auth();
    if(!session) throw new Error('User is not authenticated!')

    console.log('UPDATE USER PHOTO', { imageFile, imageBlob, imageToUpload, image });

    if(image) {
      await db.user.update({
        where: { id: data.userId },
        data: {
          image
        }
      });

      await unstable_update({ user: { ...session.user, image } });

      if(data.currentUserImageUrl) {
        const imageToDeleteId = data.currentUserImageUrl.substring(data.currentUserImageUrl.lastIndexOf('/') + 1);
        console.log('IMAGE TO DELETE', imageToDeleteId);
        // await utapi.deleteFiles(imageToDeleteId);
      }
    } else {
      throw new Error('errors.')
    }

    revalidatePath('/');
    
    return {
      status: ActionStatus.Success,
      updatedImageUrl: image,
      error: null
    };
  } catch (error: any) {
    console.log('UPDATE USER IMAGE ERROR', error)
    return {
      status: ActionStatus.Failed,
      error: error.message
    };
  }
};

export const updateUserData = async (prevState: any, formData: FormData) => {
  try {
    const name = formData.get('name');
    const email = formData.get('email');

    console.log('UPDATE USER DATA', { name, email })
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: 'Something went wrong!'
    }
  }
};