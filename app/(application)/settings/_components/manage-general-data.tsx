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
  currentWeekStartDay?: string;
  currentCurrency?: string;
  options: {
    value: string;
    label: string;
  }[];
};


export const ManageGeneralData: React.FC<IManageGeneralData> = ({
  currentWeekStartDay,
  currentCurrency,
  options
}) => {
  const { toast } = useToast();
  const t = useTranslations('SettingsPage');

  const form = useForm<UpdateUserDataSchema>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: { 
      weekStartDay: currentWeekStartDay, 
      currency: currentCurrency 
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = form;

  const onSubmitForm: SubmitHandler<UpdateUserDataSchema> = async (data) => {
    const formData = new FormData();
    if(data.weekStartDay) formData.append('weekStartDay', data.weekStartDay);
    if(data.currency) formData.append('currency', data.currency);

    const { 
      status, 
      weekStartDay, 
      currency, 
      error 
    } = await updateUserData(formData);

    if(status === ActionStatus.Success && !error) {
      const updateQuery = weekStartDay ? 
        { weekStartDay } : 
        currency ? 
          { currency } : 
          null;

      if(updateQuery) {
        toast({
          description: t((weekStartDay ? 
            'actionMessages.userWeekStartDayUpdated' : 
            currency ? 
              'actionMessages.userCurrencyUpdated' : 
              ''
          )),
          variant: 'default',
          className: 'bg-success-1 text-success-2'
        });
      }
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
        name={currentWeekStartDay ? 'weekStartDay' : 'currency'}
        control={control}
        render={({ field }) => (
          <SelectField 
            name={currentWeekStartDay ? 'weekStartDay' : 'currency'} 
            label={t(
              currentWeekStartDay ? 
                'manageGeneralData.weekStartDayLabel' : 
                'manageGeneralData.currencyLabel'
            )}
            field={field} 
            options={options} 
            disabled={isSubmitting}
            onHandleChange={handleSubmit(onSubmitForm)}
            error={errors[currentWeekStartDay ? 'weekStartDay' : 'currency']?.message}
          />
        )} 
      />
    </form>
  );
};