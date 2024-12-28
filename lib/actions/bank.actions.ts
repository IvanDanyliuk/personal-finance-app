'use server';

import { auth } from "@/auth";
import { ActionStatus } from "../types/common.types";


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
      throw new Error('IncomesPage.errors.wrongUserId');
    }
    
  } catch (error: any) {
    
  }
};