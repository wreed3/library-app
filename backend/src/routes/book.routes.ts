import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const bookController = new BookController();

router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.post('/', authenticate, authorize('ADMIN', 'LIBRARIAN'), bookController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'LIBRARIAN'), bookController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), bookController.delete);

export default router;