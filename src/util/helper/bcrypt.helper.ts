import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const comparePassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};

export const hashPassword = (password: string) => {
  const salt = genSaltSync();
  return hashSync(password, salt);
};
