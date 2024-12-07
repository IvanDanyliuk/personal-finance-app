'use server';

import { revalidatePath } from 'next/cache';
import { z as zod } from 'zod';
import bcrypt from 'bcryptjs';
import { utapi } from '../uploadthing/utapi';
import { db } from '@/db';
import { ActionStatus } from '../types/common.types';
import { auth, unstable_update } from '@/auth';
import { saltAndHashPassword } from '../helpers';
import { signIn } from 'next-auth/react';


const newPasswordData = zod.object({
  currentPassword: zod
    .string()
    .min(1, 'SettingsPage.errors.updatePassword.fieldsValidation.requiredCurrentPassword')
    .min(6, 'SettingsPage.errors.updatePassword.fieldsValidation.invalidPassword'),
  newPassword: zod
    .string()
    .min(1, 'SettingsPage.errors.updatePassword.fieldsValidation.requiredNewPassword')
    .min(6, 'SettingsPage.errors.updatePassword.fieldsValidation.invalidPassword'),
  confirmNewPassword: zod
    .string()
    .min(1, 'SettingsPage.errors.updatePassword.fieldsValidation.requiredConfirmNewPassword')
    .min(6, 'SettingsPage.errors.updatePassword.fieldsValidation.invalidPassword'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ['confirmNewPassword'],
  message: 'SettingsPage.errors.updatePassword.fieldsValidation.passwordNotMatch',
});


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

export const updatePassword = async (prevState: any, formData: FormData) => {
  try {
    const session = await auth();

    const newPassword = formData.get('newPassword') as string;
    const confirmNewPassword = formData.get('confirmNewPassword') as string;
    const currentPassword = formData.get('currentPassword') as string;

    const validatedFields = newPasswordData.safeParse({
      currentPassword, newPassword, confirmNewPassword
    });
  
    if(!validatedFields.success) {
      return {
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({ where: { id: session?.user?.id! } });

    if(!user) {
      throw new Error('errors.updatePassword.userNotFound')
    }

    const hashedNewPassword = saltAndHashPassword(newPassword);

    if(!user.password) {
      await db.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
      });
    } else {
      const passwordMatch = bcrypt.compareSync(currentPassword as string, user?.password!);

      if(!passwordMatch) {
        throw new Error('errors.updatePassword.passwordNotMatch');
      }
  
      await db.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
      });
    }

    await unstable_update({ user: { email: user.email } })

    revalidatePath('/', 'layout');

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