import { z as zod } from 'zod';


export const signUpSchema = zod.object({
  name: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredName'),
  email: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredEmail').email('Auth.errors.auth.fieldsValidation.invalidEmail'),
  password: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidPassword'),
  confirmPassword: zod.string().min(1, 'Auth.errors.auth.fieldsValidation.requiredConfirmPassword').min(6, 'Auth.errors.auth.fieldsValidation.invalidConfirmPassword'),
  image: zod.any(),
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