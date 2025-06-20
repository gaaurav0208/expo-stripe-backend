import express, { Request, Response } from "express";
const app = express();
const port = 3000;
import cors from "cors";
import Stripe from "stripe";

app.get("/", (req, res) => {
  res.send("Hello CodeSandbox!");
});

const stripe = new Stripe(
  "sk_test_51RON5LP4VT6yNHiqlhuLFo1oCzCnHVaMAWE46Y9VejO7UbWChXdCjWru4WW6b66NiOE4iQ1JRWcoaLZbf9Vo8rwP00A6u5JFKY"
);

app.use(cors());
app.use(express.json());

app.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    // 1. Create customer
    const customer = await stripe.customers.create();

    // 2. Create ephemeral key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-08-16" }
    );

    // 3. Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1999, // $19.99
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
    });

    // 4. Return to client
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}`);
});
