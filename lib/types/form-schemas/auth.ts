import { z as zod } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from '@/lib/constants';


export const signUpSchema = zod.object({
  name: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredName'),
  email: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredEmail').email('Auth.errors.auth.fieldsValidation.invalidEmail'),
  password: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidPassword'),
  confirmPassword: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredConfirmPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidConfirmPassword'),
  image: zod
    .any()
    .optional()
    .refine(
      (file) => !file || (file.size && file.size <= MAX_IMAGE_FILE_SIZE), 
      'Image size is outside the limit!'
    )
    .refine(
      (file) => !file || (file.type && ACCEPTED_IMAGE_TYPES.includes(file.type)), 
      'Unaccepted image type'
    ),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Auth.errors.auth.fieldsValidation.passwordNotMatch',
});

export const signInSchema = zod.object({
  email: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredEmail').email('Auth.errors.auth.fieldsValidation.invalidEmail'),
  password: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidPassword'),
});


export type SignUpSchema = zod.infer<typeof signUpSchema>;
export type SignInSchema = zod.infer<typeof signInSchema>;