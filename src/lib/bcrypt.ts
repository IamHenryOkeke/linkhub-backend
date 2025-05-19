import bcrypt from 'bcryptjs';

export async function isValid(value: string, hashedValue: string) {
  const res = await bcrypt.compare(value, hashedValue);
  return res;
}

export async function encrypt(value: string) {
  const res = await bcrypt.hash(value, 10);
  return res;
}
