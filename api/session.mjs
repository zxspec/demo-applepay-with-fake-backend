import got from "got";

import "dotenv/config";

const merchantIdentifier = process.env.MERCHANT_ID;
const applePayKey = process.env.APPLEPAY_MERCHANT_KEY;
const applePayCertificate = process.env.APPLEPAY_MERCHANT_CERT;

console.log("Using Merchant ID:", merchantIdentifier);

export async function startSession(validationURL, initiativeContext) {
  const merchantSession = await got
    .post(validationURL, {
      headers: { "Content-Type": "application/json" },
      https: {
        key: applePayKey,
        certificate: applePayCertificate,
      },
      body: JSON.stringify({
        merchantIdentifier,
        initiativeContext: initiativeContext,
        initiative: "web",
        displayName: "Apple Pay Demo",
      }),
    })
    .json();

  return merchantSession;
}
