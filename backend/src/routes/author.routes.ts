import { Router } from 'express';
import { AuthorController } from '../controllers/author.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const authorController = new AuthorController();

router.get('/', authorController.getAll);
router.get('/:id', authorController.getById);
router.post('/', authenticate, authorize('ADMIN', 'LIBRARIAN'), authorController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'LIBRARIAN'), authorController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), authorController.delete);

export default router;