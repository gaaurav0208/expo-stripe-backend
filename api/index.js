const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const serverless = require("serverless-http"); // Required for Vercel

const app = express();
const stripe = new Stripe("sk_test_51RON5LP4VT6yNHiqlhuLFo1oCzCnHVaMAWE46Y9VejO7UbWChXdCjWru4WW6b66NiOE4iQ1JRWcoaLZbf9Vo8rwP00A6u5JFKY", {
  apiVersion: "2023-08-16",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Vercel + Stripe!");
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-08-16" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1999,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
