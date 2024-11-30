'use client';

import { TextField } from '@/components/inputs';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';


interface IManagePersonalData {
  variant: 'name' | 'email';
  currentUserName?: string;
  currentUserEmail?: string;
};


export const ManagePersonalData: React.FC<IManagePersonalData> = ({ variant, currentUserName, currentUserEmail }) => {
  const t = useTranslations('SettingsPage.managePersonalData');
  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(false);

  const handleEditMode = () => setIsEditModeActive(!isEditModeActive);

  return (
    <div className='w-full flex justify-between items-center'>
      <p>
        {t(variant === 'name' ? 'editNameFormLabel' : 'editEmailFormLabel')}
      </p>
      <>
        {isEditModeActive ? (
          <form action='' className='flex items-center gap-3'>
            <TextField name='name' />
            <div className='flex items-center'>
              <button type='submit'>
                {t('submitBtnLabel')}
              </button>
              <button type='button' onClick={handleEditMode}>
                {t('cancelBtnLabel')}
              </button>
            </div>
          </form>
        ) : (
          <div className='flex items-center gap-3'>
            <p>
              {variant === 'name' ? currentUserName : currentUserEmail}
            </p>
            <Button type='button' onClick={handleEditMode}>
              <Pencil />
            </Button>
          </div>
        )}
      </>
    </div>
  );
};