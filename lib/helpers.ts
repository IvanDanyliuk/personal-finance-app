import bcrypt from 'bcryptjs';
import { format } from 'date-fns';


export const saltAndHashPassword = (password: any) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const extractFirstLetters = (input: string) => {
  const trimmedInput = input.trim();
  const words = trimmedInput.split(/\s+/);

  if (words.length === 0) {
      return '';
  }

  const firstLetter = words[0].charAt(0);
  const lastLetter = words.length > 1 ? words[words.length - 1].charAt(0) : '';

  return (firstLetter + lastLetter).toUpperCase();
};

export const removeFalseyFields = (obj: any) => {
  return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => Boolean(value))
  );
};

export const formatDateFilterValues = ({ 
  from, 
  to, 
  noDateFromMessage, 
  noDateToMessage, 
  noDataMessage 
}: { 
  from?: string | null; 
  to?: string | null; 
  noDateFromMessage: string;
  noDateToMessage: string;
  noDataMessage: string;
}) => {
  if(!from && !to) {
    return noDataMessage;
  }

  if(from && !to) {
    return `${format(new Date(from)!, 'dd.MM.yyyy')} - ${noDateToMessage}`;
  }

  if(!from && to) {
    return `${noDateFromMessage} - ${format(new Date(to)!, 'dd.MM.yyyy')}`;
  }

  return `${from ? format(new Date(from)!, 'dd.MM.yyyy') : ''} - ${to ? format(new Date(to)!, 'dd.MM.yyyy') : ''}`;
};