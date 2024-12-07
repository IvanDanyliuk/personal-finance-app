'use server';

import { revalidatePath } from 'next/cache';
import { utapi } from '../uploadthing/utapi';
import { db } from '@/db';
import { ActionStatus } from '../types/common.types';
import { auth, unstable_update } from '@/auth';


export const getUser = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
  return await db.user.findUnique({ where: { id } });
};

export const updateUserPhoto = async (prevState: any, formData: FormData) => {  
  try {
    const rawNewImage = formData.get('image') as string;

    const imageFile = rawNewImage ? await fetch(rawNewImage) : '';
    const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    const imageToUpload = new File([imageBlob!], `${crypto.randomUUID()}-avatar`)
    const image = imageToUpload && imageToUpload.size > 0 ? (await utapi.uploadFiles([imageToUpload]))[0].data?.url : '';

    const session = await auth();
    if(!session) throw new Error('User is not authenticated!');

    if(image) {
      await db.user.update({
        where: { email: session.user?.email! },
        data: {
          image
        }
      });

      await unstable_update({ user: { ...session.user, image } });

      if(session && session.user && session.user.image) {
        const imageToDeleteId = session.user.image.substring(session.user.image.lastIndexOf('/') + 1);
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

export const deleteUserPhoto = async () => {
  try {
    const session = await auth();

    if(!session) throw new Error('User is not authenticated!');

    await db.user.update({
      where: { email: session.user?.email! },
      data: {
        image: ''
      }
    });

    const imageToDeleteId = session.user?.image!.substring(session.user?.image!.lastIndexOf('/') + 1);
    await utapi.deleteFiles(imageToDeleteId!);

    await unstable_update({ user: { ...session.user, image: '' } });
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
    const session = await auth();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if(session && session.user && name) {
      await db.user.update({
        where: { email: session.user.email! },
        data: { name }
      });

      await unstable_update({ user: { ...session.user, name } });

      return {
        status: ActionStatus.Success,
        updatedName: name,
        error: null
      };
    };

    if(session && session.user && email) {
      await db.user.update({
        where: { email: session.user.email! },
        data: { email }
      });

      await unstable_update({ user: { ...session.user, email} });

      revalidatePath('/', 'layout');

      return {
        status: ActionStatus.Success,
        updatedEmail: email,
        error: null
      };
    }

    throw new Error('errors.general');
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: 'Something went wrong!'
    }
  }
};