import { z as zod } from 'zod';
import { ActionStatus } from '../common.types';


export const newPasswordSchema = zod.object({
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

export const updateUserDataSchema = zod.object({
  name: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredName').optional().or(zod.literal('')),
  email: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredEmail').email('Auth.errors.auth.fieldsValidation.invalidEmail').optional().or(zod.literal('')),
  weekStartDay: zod.string().optional().or(zod.literal('')),
  currency: zod.string().optional().or(zod.literal('')),
});

export const updateUserPhotoSchema = zod.object({
  image: zod.string().min(1, 'SettingsPage.errors.imageRequired')
});


export type NewPasswordSchema= zod.infer<typeof newPasswordSchema>;
export type UpdateUserDataSchema= zod.infer<typeof updateUserDataSchema>;
export type UpdateUserPhotoSchema= zod.infer<typeof updateUserPhotoSchema>;
export type BasicActionResponse = {
  status: ActionStatus,
  error: string | null
};

export interface ExtendedActionResponse extends UpdateUserDataSchema {
  status: ActionStatus,
  error: string | null
};