import { z as zod } from 'zod';
import { ActionStatus } from '../common.types';


export const setPasswordSchema = zod.object({
  password: zod
    .string()
    .min(1, 'SettingsPage.errors.setPassword.fieldsValidation.requiredPassword')
    .min(6, 'SettingsPage.errors.setPassword.fieldsValidation.invalidPassword'),
  confirmPassword: zod
    .string()
    .min(1, 'SettingsPage.errors.setPassword.fieldsValidation.requiredConfirmPassword')
    .min(6, 'SettingsPage.errors.setPassword.fieldsValidation.invalidPassword'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'SettingsPage.errors.setPassword.fieldsValidation.passwordNotMatch',
});

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
  language: zod.string().optional().or(zod.literal('')),
});

export const updateUserPhotoSchema = zod.object({
  image: zod.any()
});

export const deleteUserSchema = zod.object({
  email: zod.string().min(1, 'Confirm your email!').email('Email is not correct!')
});


export type SetPasswordSchema= zod.infer<typeof setPasswordSchema>;
export type NewPasswordSchema= zod.infer<typeof newPasswordSchema>;
export type UpdateUserDataSchema= zod.infer<typeof updateUserDataSchema>;
export type UpdateUserPhotoSchema= zod.infer<typeof updateUserPhotoSchema>;
export type DeleteUserSchema = zod.infer<typeof deleteUserSchema>;

export type BasicActionResponse = {
  status: ActionStatus,
  error: string | null
};

export interface ExtendedActionResponse extends UpdateUserDataSchema {
  status: ActionStatus,
  error: string | null
};