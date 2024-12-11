'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { SelectField } from '@/components/inputs';
import { useToast } from '@/hooks/use-toast';
import { updateUserData } from '@/lib/actions/user.actions';
import { ActionStatus } from '@/lib/types/common.types';
import { updateUserDataSchema, UpdateUserDataSchema } from '@/lib/types/form-schemas/settings';


interface IManageGeneralData {
  currentLanguage: string;
  options: {
    value: string;
    label: string;
  }[];
};


export const ManageProfileData: React.FC<IManageGeneralData> = ({
  currentLanguage,
  options
}) => {
  const { toast } = useToast();
  const t = useTranslations('SettingsPage');

  const form = useForm<UpdateUserDataSchema>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: { 
      language: currentLanguage, 
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = form;

  const onSubmitForm: SubmitHandler<UpdateUserDataSchema> = async (data) => {
    const formData = new FormData();
    formData.append('language', data.language!);

    const { 
      status, 
      language, 
      error 
    } = await updateUserData(formData);

    if(status === ActionStatus.Success && language && !error) {
      toast({
        description: t(('actionMessages.userLanguageUpdated')),
        variant: 'default',
        className: 'bg-success-1 text-success-2'
      });
    } 

    if(status === ActionStatus.Failed && error) {
      toast({
        title: t('errors.general'),
        description: t(error),
        variant: 'destructive',
        className: 'bg-danger-1 text-danger-2'
      });
    }
  };

  return (
    <form>
      <Controller 
        name='language'
        control={control}
        render={({ field }) => (
          <SelectField 
            name='language' 
            label={t('manageProfileData.languageLabel')}
            field={field} 
            options={options} 
            disabled={isSubmitting}
            onHandleChange={handleSubmit(onSubmitForm)}
            error={errors['language']?.message}
          />
        )} 
      />
    </form>
  );
};