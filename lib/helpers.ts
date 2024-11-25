import bcrypt from 'bcryptjs';

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