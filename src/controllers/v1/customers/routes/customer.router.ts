import { Router, Request, Response } from "express";
import { Customer } from "../models/Customer";
import { requireAuth } from "../../users/routes/auth.router";
import { BankAccount } from "../../accounts/models/BankAccount";

const router: Router = Router();

// Get all customers
router.get("/", async (req: Request, res: Response) => {
  const items = await Customer.findAndCountAll({ 
      order: [["id", "DESC"]],
      include: [BankAccount]
     });
  res.send(items);
});

//Get customer by id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("id can not be null");
  }

  let account = await Customer.findOne({
    where: {
      id: id,
    },
    include: [BankAccount]
  });

  if (!account) {
    return res.status(404).send("No customer found");
  }

  return res.status(200).send(account);
});

// Create new customer
router.post("/", requireAuth, async (req: Request, res: Response) => {

  const first_name = req.body.firstName;
  const last_name = req.body.lastName;
  const email = req.body.email;

  if (!email) {
    return res
      .status(400)
      .send({ message: "email is required" });
  }

  if (!first_name) {
    return res
      .status(400)
      .send({ message: "firsr name is required" });
  }

  if (!last_name) {
    return res
      .status(400)
      .send({ message: "last name is required" });
  }

  const customer = await new Customer({
      email : email,
      first_name : first_name,
      last_name : last_name
  });

  const saved_customer = await customer.save();

  res.status(201).send(saved_customer);

});

export const CustomerRouter: Router = router;


