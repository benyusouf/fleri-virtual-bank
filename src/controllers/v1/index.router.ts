import { Router, Request, Response } from 'express';
import { AccountRouter } from './accounts/routes/account.router';
import { CustomerRouter } from './customers/routes/customer.router';
import { TransactionRoute } from './transactions/routes/transaction.router';
import { UserRouter } from './users/routes/user.router';

const router: Router = Router();

router.use('/accounts', AccountRouter);
router.use('/users', UserRouter);
router.use('/customers', CustomerRouter )
router.use('/transactions', TransactionRoute)

router.get('/', async (req: Request, res: Response) => {    
    res.send(`V1`);
});

export const IndexRouter: Router = router;