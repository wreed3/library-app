import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const borrowSchema = z.object({
  bookId: z.string(),
  dueDate: z.string(),
});

export class BorrowController {
  async borrowBook(req: AuthRequest, res: Response) {
    try {
      const data = borrowSchema.parse(req.body);
      const userId = req.user!.id;

      const book = await prisma.book.findUnique({
        where: { id: data.bookId },
      });

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if (book.availableCopies <= 0) {
        return res.status(400).json({ error: 'No copies available' });
      }

      const borrowRecord = await prisma.$transaction(async (tx) => {
        const record = await tx.borrowRecord.create({
          data: {
            userId,
            bookId: data.bookId,
            dueDate: new Date(data.dueDate),
          },
          include: {
            book: true,
            user: true,
          },
        });

        await tx.book.update({
          where: { id: data.bookId },
          data: { availableCopies: { decrement: 1 } },
        });

        return record;
      });

      res.status(201).json(borrowRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to borrow book' });
    }
  }

  async returnBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const borrowRecord = await prisma.borrowRecord.findUnique({
        where: { id },
        include: { book: true },
      });

      if (!borrowRecord) {
        return res.status(404).json({ error: 'Borrow record not found' });
      }

      if (borrowRecord.userId !== userId && req.user!.role === 'MEMBER') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const returnDate = new Date();
      const fine = returnDate > borrowRecord.dueDate
        ? Math.ceil((returnDate.getTime() - borrowRecord.dueDate.getTime()) / (1000 * 60 * 60 * 24)) * 1.0
        : 0;

      const updated = await prisma.$transaction(async (tx) => {
        const record = await tx.borrowRecord.update({
          where: { id },
          data: {
            status: 'RETURNED',
            returnDate,
            fine,
          },
          include: {
            book: true,
            user: true,
          },
        });

        await tx.book.update({
          where: { id: borrowRecord.bookId },
          data: { availableCopies: { increment: 1 } },
        });

        return record;
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to return book' });
    }
  }

  async getMyBorrows(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const borrows = await prisma.borrowRecord.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              author: true,
              category: true,
            },
          },
        },
        orderBy: { borrowDate: 'desc' },
      });

      res.json(borrows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch borrow records' });
    }
  }

  async getAllBorrows(req: AuthRequest, res: Response) {
    try {
      if (req.user!.role === 'MEMBER') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { status } = req.query;
      const where: any = {};

      if (status) {
        where.status = status;
      }

      const borrows = await prisma.borrowRecord.findMany({
        where,
        include: {
          book: {
            include: {
              author: true,
              category: true,
            },
          },
          user: true,
        },
        orderBy: { borrowDate: 'desc' },
      });

      res.json(borrows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch borrow records' });
    }
  }
}