import { Router, Request, Response } from "express";
import { BankAccount } from "../models/BankAccount";
import { requireAuth } from "../../users/routes/auth.router";
import { Customer } from "../../customers/models/Customer";

const router: Router = Router();

// Get all bank accounts
router.get("/", async (req: Request, res: Response) => {
  const items = await BankAccount.findAndCountAll({ order: [["id", "DESC"]] });
  res.send(items);
});

//Get bank account by id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("id can not be null");
  }

  let account = await BankAccount.findOne({
    where: {
      id: id,
    },
  });

  if (!account) {
    return res.status(404).send("No account found");
  }

  return res.status(200).send(account);
});

//Get bank account balance
router.get("/:accountNumber", async (req: Request, res: Response) => {
    const { account_number } = req.params;
  
    if (!account_number) {
      return res.status(400).send("account number can not be null");
    }
  
    let account = await BankAccount.findOne({
      where: {
        account_number: account_number,
      },
    });
  
    if (!account) {
      return res.status(404).send("No account found");
    }
  
    return res.status(200).send(account.balance);
  });

//Get customer bank accounts
router.get("/customers/:customerId", async (req: Request, res: Response) => {

    const { customer_id } = req.params;
  
    if (!customer_id) return res.status(400).send("customerId can not be null");

    let customer = await Customer.findOne({
        where: {
          id: customer_id,
        }
      });

      if(!customer) return res.status(400).send('customer does not exist');
  
    let accounts = await BankAccount.findAndCountAll({
      where: {
        customer_id: customer_id,
      },
    });
  
    if (!accounts || accounts.count < 1) return res.status(404).send("No account found");
  
    return res.status(200).send(accounts);
  });


// Create new bank account
router.post("/", requireAuth, async (req: Request, res: Response) => {

  const customer_id = req.body.customer_id;
  const deposit = req.body.deposit;

  if (!customer_id)
    return res
      .status(400)
      .send({ message: "customer_id is required" });

      let customer = await Customer.findOne({
        where: {
          id: customer_id,
        }
      });

      if(!customer) return res.status(400).send('customer does not exist, account creation failed');

  const item = await new BankAccount({
    account_number: generateAccountNumber().toString(),
    customer_id: customer_id,
    balance: deposit ? deposit : 0 
  });

  const saved_account = await item.save();

  res.status(201).send(saved_account);

});

function generateAccountNumber(){
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

export const AccountRouter: Router = router;


