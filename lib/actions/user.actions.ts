'use server';

import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { utapi, utFile } from '../uploadthing/utapi';
import { db } from '@/db';
import { ActionStatus } from '../types/common.types';


export const getUser = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const updateUserPhoto = async (data: any, prevState: any, formData: FormData) => {
  try {
    const rawNewImage = formData.get('image') as string;

    const imageFile = rawNewImage ? await fetch(rawNewImage) : '';
    const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    const imageToUpload = new utFile([imageBlob!], `${data.userId}-avatar`, { customId: `${data.userId}-avatar` });
    const image = imageToUpload && imageToUpload.size > 0 ? (await utapi.uploadFiles([imageToUpload]))[0].data?.url : '';

    console.log('UPDATE USER PHOTO', { rawNewImage, data, image });

    await db.user.update({
      where: { id: data.userId },
      data: {
        image
      }
    });

    return {
      status: ActionStatus.Success,
      error: null
    };
  } catch (error: any) {
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