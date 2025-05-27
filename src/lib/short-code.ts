import prisma from './prisma';
import { AppError } from '../error/errorHandler';

const characters =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateBase62(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const createUniqueShortCode = async () => {
  const MAX_ATTEMPTS = 5;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const shortCode = generateBase62();

    const existing = await prisma.link.findUnique({ where: { shortCode } });

    if (!existing) return shortCode;
  }

  throw new AppError(
    'Failed to generate unique short code after several attempts',
    500,
  );
};

export default createUniqueShortCode;
