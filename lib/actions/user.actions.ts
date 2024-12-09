'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { utapi } from '../uploadthing/utapi';
import { db } from '@/db';
import { ActionStatus } from '../types/common.types';
import { auth, unstable_update } from '@/auth';
import { saltAndHashPassword } from '../helpers';
import { newPasswordSchema, updateUserDataSchema, updateUserPhotoSchema } from '../types/form-schemas/settings';


export const getUser = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
  return await db.user.findUnique({ where: { id } });
};

export const updateUserPhoto = async (formData: FormData) => {  
  try {
    const session = await auth();
    if(!session) throw new Error('User is not authenticated!');

    const validatedImage = updateUserPhotoSchema.safeParse({ image: formData.get('image') });

    if(!validatedImage.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedImage.error.flatten().fieldErrors,
      };
    }

    const imageFile = validatedImage.data?.image ? await fetch(validatedImage.data?.image) : '';
    const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    const imageToUpload = new File([imageBlob!], `${crypto.randomUUID()}-avatar`)
    const image = imageToUpload && imageToUpload.size > 0 ? (await utapi.uploadFiles([imageToUpload]))[0].data?.url : '';

    if(image) {
      await db.user.update({
        where: { email: session.user!.email! },
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
      where: { email: session.user!.email! },
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

export const updateUserData = async (formData: FormData) => {
  try {
    const session = await auth();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if(session && session.user && name) {
      const validatedName = updateUserDataSchema.safeParse({ name });

      if(!validatedName.success) {
        return {
          status: ActionStatus.Failed,
          fieldError: validatedName.error.flatten().fieldErrors,
        };
      }

      await db.user.update({
        where: { email: session.user.email! },
        data: { name: validatedName.data.name }
      });

      await unstable_update({ user: { ...session.user, name: validatedName.data.name } });

      return {
        status: ActionStatus.Success,
        updatedName: validatedName.data.name,
        error: null
      };
    };

    if(session && session.user && email) {
      const validatedEmail = updateUserDataSchema.safeParse({ email });

      if(!validatedEmail.success) {
        return {
          status: ActionStatus.Failed,
          fieldError: validatedEmail.error.flatten().fieldErrors,
        };
      }

      const existingUser = await db.user.findUnique({ where: { email: validatedEmail.data.email } });
      if(existingUser) {
        throw new Error('errors.userExists')
      }

      await db.user.update({
        where: { email: session.user.email! },
        data: { email: validatedEmail.data.email }
      });

      await unstable_update({ user: { ...session.user, email: validatedEmail.data.email} });

      revalidatePath('/', 'layout');

      return {
        status: ActionStatus.Success,
        updatedEmail: validatedEmail.data.email,
        error: null
      };
    }

    throw new Error('errors.general');
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: error.message
    }
  }
};

export const updatePassword = async (formData: FormData) => {
  try {
    const session = await auth();

    const newPassword = formData.get('newPassword') as string;
    const confirmNewPassword = formData.get('confirmNewPassword') as string;
    const currentPassword = formData.get('currentPassword') as string;

    const validatedFields = newPasswordSchema.safeParse({
      currentPassword, newPassword, confirmNewPassword
    });
  
    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({ where: { id: session!.user!.id! } });

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
      const passwordMatch = bcrypt.compareSync(validatedFields.data.currentPassword as string, user.password!);

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