import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { UserRoles } from '../src/utils/const';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await argon.hash('SuperPassword!4');

  const userRole = await prisma.role.upsert({
    where: {
      name: UserRoles.USER,
    },
    update: {},
    create: {
      name: UserRoles.USER,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: {
      name: UserRoles.ADMIN,
    },
    update: {},
    create: {
      name: UserRoles.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'user@user.user',
    },
    update: {},
    create: {
      name: 'John Doe',
      email: '2dY5A@example.com',
      password: hashedPassword,
      isActive: true,
      gpdr: new Date(),
      roleId: userRole.id,
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'user@user.user',
    },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'user2@user.user',
      password: hashedPassword,
      isActive: true,
      gpdr: new Date(),
      roleId: adminRole.id,
    },
  });

  const product = await prisma.product.create({
    data: {
      name: 'iPhone 17',
      price: 999000,
      isAvailable: true,
    },
  });

  const firstCategory = await prisma.productCategory.create({
    data: {
      name: 'Electronics',
    },
  });

  const secondCategory = await prisma.productCategory.create({
    data: {
      name: 'Phone',
    },
  });

  await prisma.productHasProductCategory.create({
    data: {
      productId: product.id,
      productCategoryId: firstCategory.id,
    },
  });

  await prisma.productHasProductCategory.create({
    data: {
      productId: product.id,
      productCategoryId: secondCategory.id,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
