import { Router } from 'express';
import { body } from 'express-validator';
import * as booksController from '../controllers/books.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, booksController.getBooks);
router.get('/:id', authenticate, booksController.getBook);
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'LIBRARIAN'),
  [
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  booksController.createBook
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'LIBRARIAN'),
  booksController.updateBook
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'LIBRARIAN'),
  booksController.deleteBook
);

export default router;