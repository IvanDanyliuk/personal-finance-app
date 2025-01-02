import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from '@/lib/constants';
import { z as zod } from 'zod';


export const bankSchema = zod.object({
  name: zod.string().min(1, 'Admin.Banks.errors.fieldsValidation.requiredName'),
  country: zod.string().min(1, 'Admin.Banks.errors.fieldsValidation.requiredCountry'),
  logo: zod
    .any()
    .refine((file) => file.size <= MAX_IMAGE_FILE_SIZE, 'Admin.Banks.errors.fieldsValidation.maxImageSizeLimit')
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Admin.Banks.errors.fieldsValidation.invalidImageType'),
});

export type BankSchema = zod.infer<typeof bankSchema>;