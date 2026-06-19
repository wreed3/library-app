import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: {
      email: 'admin@library.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Fiction' },
      update: {},
      create: { name: 'Fiction' },
    }),
    prisma.category.upsert({
      where: { name: 'Non-Fiction' },
      update: {},
      create: { name: 'Non-Fiction' },
    }),
    prisma.category.upsert({
      where: { name: 'Science' },
      update: {},
      create: { name: 'Science' },
    }),
    prisma.category.upsert({
      where: { name: 'History' },
      update: {},
      create: { name: 'History' },
    }),
    prisma.category.upsert({
      where: { name: 'Technology' },
      update: {},
      create: { name: 'Technology' },
    }),
  ]);

  console.log('Created categories:', categories.length);

  // Create sample authors
  const authors = await Promise.all([
    prisma.author.create({ data: { name: 'J.K. Rowling' } }),
    prisma.author.create({ data: { name: 'George Orwell' } }),
    prisma.author.create({ data: { name: 'Isaac Asimov' } }),
  ]);

  console.log('Created authors:', authors.length);

  // Create sample books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        isbn: '9780439708180',
        title: "Harry Potter and the Sorcerer's Stone",
        description: 'A young wizard discovers his magical heritage.',
        publisher: 'Scholastic',
        publishedDate: new Date('1997-06-26'),
        pageCount: 309,
        quantity: 3,
        available: 3,
        authors: { connect: [{ id: authors[0].id }] },
        categories: { connect: [{ id: categories[0].id }] },
      },
    }),
    prisma.book.create({
      data: {
        isbn: '9780451524935',
        title: '1984',
        description: 'A dystopian social science fiction novel.',
        publisher: 'Signet Classic',
        publishedDate: new Date('1949-06-08'),
        pageCount: 328,
        quantity: 2,
        available: 2,
        authors: { connect: [{ id: authors[1].id }] },
        categories: { connect: [{ id: categories[0].id }] },
      },
    }),
    prisma.book.create({
      data: {
        isbn: '9780553293357',
        title: 'Foundation',
        description: 'A science fiction novel about the fall of a galactic empire.',
        publisher: 'Spectra',
        publishedDate: new Date('1951-06-01'),
        pageCount: 255,
        quantity: 2,
        available: 2,
        authors: { connect: [{ id: authors[2].id }] },
        categories: { connect: [{ id: categories[2].id }] },
      },
    }),
  ]);

  console.log('Created books:', books.length);

  // Create sample member
  const memberPassword = await bcrypt.hash('member123', 10);
  const member = await prisma.member.create({
    data: {
      cardNumber: 'LIB001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-0100',
      address: '123 Main St, City, State 12345',
      status: 'ACTIVE',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  });

  console.log('Created member:', member.cardNumber);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });