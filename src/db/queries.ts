import { AppError } from '../error/errorHandler';
import { Prisma } from '../generated/prisma';
import prisma from '../lib/prisma';

export async function getUserByEmail(email: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error occured while finding user by email', error.message);
    } else {
      console.error('Error occured while finding user by email', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getUserByUsername(username: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Error occured while finding user by username',
        error.message,
      );
    } else {
      console.error('Error occured while finding user by username:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getUserById(id: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error occured while finding user by id', error.message);
    } else {
      console.error('Error occured while finding user by id', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getUserByGoogleId(googleId: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        googleId,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Error occured while finding user by google id',
        error.message,
      );
    } else {
      console.error('Error occured while finding user by google id', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function createUser(values: Prisma.UserCreateInput) {
  try {
    const data = await prisma.user.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating new user:', error.message);
    } else {
      console.error('Error creating new user:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function updateUser(id: string, values: Prisma.UserUpdateInput) {
  try {
    const data = await prisma.user.update({
      where: { id },
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating user:', error.message);
    } else {
      console.error('Error updating user:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function deleteUser(id: string) {
  try {
    const data = await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting user:', error.message);
    } else {
      console.error('Error deleting user:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function createPasswordResetToken(
  values: Prisma.PasswordResetTokenCreateInput,
) {
  try {
    const data = await prisma.passwordResetToken.create({
      data: values,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating token:', error.message);
    } else {
      console.error('Error creating token:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getPasswordResetTokenByHashedToken(tokenHash: string) {
  try {
    const data = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting token:', error.message);
    } else {
      console.error('Error getting token:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function deletePasswordResetToken(userId: string) {
  try {
    const data = await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating token:', error.message);
    } else {
      console.error('Error creating token:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getAllUserLinks(id: string) {
  try {
    const data = await prisma.link.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting all links:', error.message);
    } else {
      console.error('Error getting all links:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getUserLinkById(id: string, userId: string) {
  try {
    const data = await prisma.link.findUnique({
      where: {
        id,
        userId,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting link:', error.message);
    } else {
      console.error('Error getting link:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getUserLinkByUniqueUrl(userId: string, url: string) {
  try {
    const data = await prisma.link.findUnique({
      where: {
        userId_url: {
          userId,
          url,
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting link:', error.message);
    } else {
      console.error('Error getting link:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function createLink(values: Prisma.LinkCreateInput) {
  try {
    const data = await prisma.link.create({
      data: values,
      select: {
        id: true,
        title: true,
        url: true,
        imageUrl: true,
        clickCount: true,
        createdAt: true,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating link:', error.message);
    } else {
      console.error('Error creating link:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function updateUserLink(
  id: string,
  userId: string,
  values: Prisma.LinkUpdateInput,
) {
  try {
    const data = await prisma.link.update({
      where: { id, userId },
      data: values,
      select: {
        id: true,
        title: true,
        url: true,
        imageUrl: true,
        clickCount: true,
        createdAt: true,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating link:', error.message);
    } else {
      console.error('Error updating link:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function deleteUserLink(id: string, userId: string) {
  try {
    const data = await prisma.link.delete({
      where: { id, userId },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting link:', error.message);
    } else {
      console.error('Error deleting link:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getUserPublicProfileWithLinksByUsername(
  username: string,
) {
  try {
    const data = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        links: {
          where: {
            isActive: true,
          },
          select: {
            title: true,
            shortCode: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Error occurred while finding user by username:',
        error.message,
      );
    } else {
      console.error('Error occurred while finding user by username:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function getUserPublicLinkByShortCode(shortCode: string) {
  try {
    const data = await prisma.link.findUnique({
      where: { shortCode },
      select: {
        id: true,
        title: true,
        url: true,
        imageUrl: true,
        isActive: true,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error occurred while finding link by id:', error.message);
    } else {
      console.error('Error occurred while finding link by id:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}

export async function updateUserPublicLinkByLinkId(id: string) {
  try {
    const data = await prisma.link.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error occurred while updating link by id:', error.message);
    } else {
      console.error('Error occurred while updating link by id:', error);
    }
    throw new AppError('Internal server error', 500);
  }
}
