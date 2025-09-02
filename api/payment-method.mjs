import { stateBeforeCouponApplied } from "./mocks.mjs";
export async function updatePaymentMethod(paymentMethod) {
  console.log("### update payment method: ", paymentMethod);

  // it is triggerd when user selects different card in the Apple Pay sheet

  // https://developer.apple.com/documentation/applepayontheweb/applepaysession/onpaymentmethodselected
  // https://developer.apple.com/documentation/applepayontheweb/applepaysession/completepaymentmethodselection
  // https://developer.apple.com/documentation/applepayontheweb/applepaypaymentmethodupdate
  // https://www.consumerfinance.gov/ask-cfpb/how-are-prepaid-cards-debit-cards-and-credit-cards-different-en-433/

  // simulate that you do not support prepaid or store cards
  if (paymentMethod.type === "prepaid" || paymentMethod.type === "store") {
    return {
      ...stateBeforeCouponApplied,
      errors: [
        {
          code: "unsupported_card",
          message:
            "Prepaid and store cards are not supported, please select another card.",
        },
      ],
    };
  }

  return {
    ...stateBeforeCouponApplied,
  };
}
