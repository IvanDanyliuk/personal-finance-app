'use client';

import { ConfirmDialog } from '@/components/common';


interface IDeleteUser {
  email: string;
}


export const DeleteUser: React.FC<IDeleteUser> = ({ email }) => {
  return (
    <ConfirmDialog
      triggerBtnLabel='SettingsPage.deleteUser.confirmationModal.btnLabel'
      title='SettingsPage.deleteUser.confirmationModal.title'
      message='SettingsPage.deleteUser.confirmationModal.message'
      action={() => {}}
    >
      Form
    </ConfirmDialog>
  );
};