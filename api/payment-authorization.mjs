export async function authorizePayment(payment) {
  console.log("### authorize payment: ", payment);

  // https://developer.apple.com/documentation/applepayontheweb/applepaysession/onpaymentauthorized
  // https://developer.apple.com/documentation/applepayontheweb/applepaysession/completepayment
  // https://developer.apple.com/documentation/applepayontheweb/applepaypaymentauthorizationresult

  const { shippingContact, billingContact, token } = payment;

  // TODO add shipping address and billing address validation if needed
  console.log("### shipping address validation: ", shippingContact);
  console.log("### billing address validation: ", billingContact);
  // TODO send token to your PSP and complete the payment
  console.log("### sending token to PSP: ", token);

  // in case the payment is successful
  return {
    success: true,
  };
}
