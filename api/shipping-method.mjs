import { shippingMethods } from "./mocks.mjs";

export async function updateShippingMethod(applePayShippingMethod) {
  console.log("### selected shipping method: ", applePayShippingMethod);
  const { identifier } = applePayShippingMethod;
  // simulate async operation of updating shipping details needed to calculate taxes an shipping costs
  // return information needed for completeshippingcontactselection()
  // https://developer.apple.com/documentation/applepayontheweb/applepaysession/completeshippingmethodselection
  // return type https://developer.apple.com/documentation/applepayontheweb/applepayshippingmethodupdate
  const selectedShippingMethod = shippingMethods.find(
    (method) => method.identifier === identifier
  );
  const productsCost = 10; // for demo purposes, fixed products cost
  const shippingCost = parseFloat(selectedShippingMethod.amount);
  const tax = 1.99; // for demo purposes, fixed tax amount

  const total = productsCost + shippingCost + tax;

  const updatedBasketState = await Promise.resolve({
    newTotal: {
      label: "Demo (Card is not charged)",
      amount: total.toFixed(2),
    },
    newLineItems: [
      { label: "Subtotal", amount: productsCost.toFixed(2) },
      { label: "Shipping", amount: shippingCost.toFixed(2) },
      { label: "Tax", amount: tax.toFixed(2) },
    ],
  });

  return updatedBasketState;
}
