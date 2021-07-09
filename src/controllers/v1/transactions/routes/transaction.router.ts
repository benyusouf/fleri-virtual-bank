import { Router, Request, Response } from "express";
import { BankAccount } from "../../accounts/models/BankAccount";
import { requireAuth } from "../../users/routes/auth.router";
import { Transaction } from "../models/Transaction";

const router: Router = Router();

// Get all transactions
router.get("/", async (req: Request, res: Response) => {
  const items = await Transaction.findAndCountAll({ order: [["id", "DESC"]] });
  res.send(items);
});

//Get transaction by id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("id can not be null");
  }

  let account = await Transaction.findOne({
    where: {
      id: id,
    },
  });

  if (!account) {
    return res.status(404).send("No account found");
  }

  return res.status(200).send(account);
});

//Get bank account transactions
router.get("/accounts/:accountNumber", async (req: Request, res: Response) => {

    const { account_number } = req.params;
  
    if (!account_number) return res.status(400).send("account_number can not be null");

    let account = await BankAccount.findOne({
        where: {
          account_number: account_number,
        }
      });

      if(!account) return res.status(400).send('account does not exist');
  
    let transactions = await Transaction.findAndCountAll({
      where: {
        account_id: account.id,
      },
    });
  
    if (!transactions || transactions.count < 1) return res.status(404).send("No transaction found");
  
    return res.status(200).send(transactions);
  });


// Transfer money
router.post("/", requireAuth, async (req: Request, res: Response) => {

  const toAccountNumber = req.body.toAccountNumber;
  const fromAccountNumber = req.body.fromAccountNumber;
  const amount = req.body.amount;

  if(amount < 1) return res.status(400).send('amount is too low');


  if (!fromAccountNumber)
  return res
    .status(400)
    .send({ message: "fromAccountNumber is required" });

    let fromAccount = await BankAccount.findOne({
      where: {
        account_number: fromAccountNumber,
      }
    });

    if(!fromAccount) return res.status(400).send('source account does not exist');


  if (!toAccountNumber)
    return res
      .status(400)
      .send({ message: "fromAccountNumber is required" });

      let toAccount = await BankAccount.findOne({
        where: {
          account_number: toAccountNumber,
        }
      });

      if(!toAccount) return res.status(400).send('destination account does not exist');


    const charges = 10;

    if(fromAccount.balance < (amount + charges)) return res.status(400).send('Insufficient funds');

  const debit_transaction = await new Transaction({
    reference: `TR${generateRandom().toString()}`,
    amount: amount,
    type: TransactionType.Debit,
    balanceBefore: fromAccount.balance,
    balanceAfter: fromAccount.balance - amount - charges,
    account_id: fromAccount.id 
  });

  await debit_transaction.save();

  const credit_transaction = await new Transaction({
    reference: `TR${generateRandom().toString()}`,
    amount: amount,
    type: TransactionType.Credit,
    balanceBefore: toAccount.balance,
    balanceAfter: toAccount.balance + amount,
    account_id: toAccount.id 
  });

  await credit_transaction.save();

  res.status(201).send();

});

function generateRandom(){
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

export const TransactionRoute: Router = router;


