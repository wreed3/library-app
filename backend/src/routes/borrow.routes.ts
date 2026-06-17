import { Router } from 'express';
import { BorrowController } from '../controllers/borrow.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const borrowController = new BorrowController();

router.post('/', authenticate, borrowController.borrowBook);
router.post('/:id/return', authenticate, borrowController.returnBook);
router.get('/my-borrows', authenticate, borrowController.getMyBorrows);
router.get('/', authenticate, borrowController.getAllBorrows);

export default router;