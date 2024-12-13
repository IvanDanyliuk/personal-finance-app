import { ActionStatus } from "../types/common.types";

export const createIncome = async (formData: FormData) => {
  try {
    const amount = formData.get('amount');
    const currency = formData.get('currency');
    const source = formData.get('source');

    console.log('CREATE INCOME', { amount, currency, source })
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
}