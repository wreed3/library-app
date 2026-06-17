import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const bookSchema = z.object({
  title: z.string().min(1),
  isbn: z.string().min(10),
  description: z.string().optional(),
  publishedDate: z.string().optional(),
  publisher: z.string().optional(),
  totalCopies: z.number().int().positive().default(1),
  coverImage: z.string().url().optional(),
  authorId: z.string(),
  categoryId: z.string(),
});

export class BookController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const { search, categoryId, authorId, available } = req.query;

      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { isbn: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (authorId) {
        where.authorId = authorId;
      }

      if (available === 'true') {
        where.availableCopies = { gt: 0 };
      }

      const books = await prisma.book.findMany({
        where,
        include: {
          author: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          author: true,
          category: true,
          borrowRecords: {
            where: { status: 'ACTIVE' },
            include: { user: true },
          },
        },
      });

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const data = bookSchema.parse(req.body);

      const book = await prisma.book.create({
        data: {
          ...data,
          publishedDate: data.publishedDate ? new Date(data.publishedDate) : null,
          availableCopies: data.totalCopies,
        },
        include: {
          author: true,
          category: true,
        },
      });

      res.status(201).json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create book' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = bookSchema.partial().parse(req.body);

      const book = await prisma.book.update({
        where: { id },
        data: {
          ...data,
          publishedDate: data.publishedDate ? new Date(data.publishedDate) : undefined,
        },
        include: {
          author: true,
          category: true,
        },
      });

      res.json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update book' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.book.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete book' });
    }
  }
}