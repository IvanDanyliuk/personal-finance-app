'use server';

import { revalidatePath } from 'next/cache';
import { utapi } from '../uploadthing/utapi';
import { db } from '@/db';
import { ActionStatus } from '../types/common.types';
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
    if(!session) throw new Error('User is not authenticated!');

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
        await utapi.deleteFiles(imageToDeleteId);
      }
    } else {
      throw new Error('errors.');
    }
    return {
      status: ActionStatus.Success,
      updatedImageUrl: image,
      error: null
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: error.message
    };
  }
};

export const deleteUserPhoto = async (userId: string, imageUrl: string) => {
  try {
    const session = await auth();

    if(!session) throw new Error('User is not authenticated!');

    await db.user.update({
      where: { id: userId },
      data: {
        image: ''
      }
    });

    await unstable_update({ user: { ...session.user, image: '' } });

    const imageToDeleteId = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    await utapi.deleteFiles(imageToDeleteId);

    revalidatePath('/', 'layout');

    return {
      status: ActionStatus.Success,
      error: null
    }
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

  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: 'Something went wrong!'
    }
  }
};