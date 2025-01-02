'use server';

import { auth } from "@/auth";
import { ActionStatus } from "../types/common.types";
import { getUser } from "./user.actions";
import { db } from "@/db";
import { bankSchema } from "../types/form-schemas/admin";
import { utapi } from "../uploadthing/utapi";
import { convertFileToString } from '../helpers';


export const getBanks = async () => {
  try {
    
    return {
      status: ActionStatus.Success,
      data: [],
      count: 0,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      data: [],
      count: 0,
      error: error.message,
    };
  }
};

export const createBank = async (formData: FormData) => {
  try {
    const session = await auth();

    if(!session) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    if(session && !session.user || !session.user?.email) {

    }

    const user = await getUser(session.user!.email!);

    if(!user) {
      throw new Error('HomePage.errors.wrongUserId');
    }

    if(user.role !== 'ADMIN') {
      throw new Error('HomePage.errors.notAdmin');
    }

    const validatedFields = bankSchema.safeParse({
      name: formData.get('name'), 
      country: formData.get('country'), 
      logo: formData.get('logo')
    });

    if(!validatedFields.success) {
      return {
        status: ActionStatus.Failed,
        fieldError: validatedFields.error.flatten().fieldErrors,
      };
    }

    // const imageFile = validatedFields.data.logo ? await fetch(validatedFields.data.logo) : '';
    // const imageBlob = imageFile ? await imageFile.blob() : new Blob();
    // const imageToUpload = new File([imageBlob!], `${validatedFields.data.name}-avatar`);
    // const uploadedLogo = imageToUpload && imageToUpload.size > 0 ? 
    //   (await utapi.uploadFiles([imageToUpload]))[0].data?.url : 
    //   '';

    const uploadedLogo = validatedFields.data.logo.size > 0 ? 
      (await utapi.uploadFiles([validatedFields.data.logo]))[0].data?.url : 
      '';

    console.log('CREATE BANK: FINAL DATA', {validatedFields, uploadedLogo})
    
    // await db.bank.create({ 
    //   data: { 
    //     ...validatedFields.data, 
    //     logo: uploadedLogo! 
    //   } 
    // });

    return {
      status: ActionStatus.Success,
      error: null,
    };
  } catch (error: any) {
    return {
      status: ActionStatus.Failed,
      error: error.message,
    };
  }
};