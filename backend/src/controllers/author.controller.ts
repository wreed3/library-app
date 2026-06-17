import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const authorSchema = z.object({
  name: z.string().min(1),
  bio: z.string().optional(),
  birthDate: z.string().optional(),
});

export class AuthorController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const authors = await prisma.author.findMany({
        include: {
          _count: {
            select: { books: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      res.json(authors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch authors' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const author = await prisma.author.findUnique({
        where: { id },
        include: {
          books: {
            include: {
              category: true,
            },
          },
        },
      });

      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      res.json(author);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch author' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const data = authorSchema.parse(req.body);

      const author = await prisma.author.create({
        data: {
          ...data,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
        },
      });

      res.status(201).json(author);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create author' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = authorSchema.partial().parse(req.body);

      const author = await prisma.author.update({
        where: { id },
        data: {
          ...data,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        },
      });

      res.json(author);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update author' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.author.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete author' });
    }
  }
}