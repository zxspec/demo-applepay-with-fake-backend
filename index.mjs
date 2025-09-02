import "dotenv/config";
import https from "https";
import express from "express";
import bodyParser from "body-parser";

import { startSession } from "./api/session.mjs";
import { updateShippingContact } from "./api/shipping-contact.mjs";
import { updateShippingMethod } from "./api/shipping-method.mjs";
import { applyCoupon, deleteCoupon } from "./api/coupons.mjs";
import { authorizePayment } from "./api/payment-authorization.mjs";
import { updatePaymentMethod } from "./api/payment-method.mjs";

import "dotenv/config";

const PORT = process.env.PORT || 3000;
const key = process.env.APPLEPAY_MERCHANT_KEY;
const cert = process.env.APPLEPAY_MERCHANT_CERT;

const app = express();
// ApplePay requires HTTPS connection
// for the sake of simplicity we re-use the same certificate and private key as for merchant validation
const server = https.createServer({ key: key, cert: cert }, app);

app.use(express.static("public"));

app.use(bodyParser.json());

app.get("/api/start-session", async (req, res) => {
  const session = await startSession(
    req.query.validationURL,
    req.query.initiativeContext
  );

  console.log("### session: ", session);

  res.json(session);
});

app.post("/api/shipping-address", async (req, res) => {
  console.log("### shipping-address: ", req.body);

  const updatedTotalAndLineItems = await updateShippingContact(req.body);
  res.json(updatedTotalAndLineItems);
});

app.post("/api/shipping-method", async (req, res) => {
  console.log("### shipping-method: ", req.body);

  const updatedTotalAndLineItems = await updateShippingMethod(req.body);
  res.json(updatedTotalAndLineItems);
});

app.post("/api/payment-authorization", async (req, res) => {
  console.log("### payment-authorization: ", req.body);

  const updatedTotalAndLineItems = await authorizePayment(req.body);
  res.json(updatedTotalAndLineItems);
});

app.post("/api/payment-method", async (req, res) => {
  console.log("### payment-method: ", req.body);

  const updatedTotalAndLineItems = await updatePaymentMethod(req.body);
  res.json(updatedTotalAndLineItems);
});

app.post("/api/coupon", async (req, res) => {
  console.log("### coupon: ", req.body);

  const updatedTotalAndLineItems = await applyCoupon(req.body);
  res.json(updatedTotalAndLineItems);
});

app.delete("/api/coupon", async (req, res) => {
  console.log("### delete coupon");

  const updatedTotalAndLineItems = await deleteCoupon(req.body);
  res.json(updatedTotalAndLineItems);
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
