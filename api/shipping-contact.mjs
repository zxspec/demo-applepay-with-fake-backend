import { shippingMethods } from "./mocks.mjs";

export async function updateShippingContact(reductedShippingAddress) {
  console.log("### selected shipping address: ", reductedShippingAddress);
  // simulate async operation of updating shipping details needed to calculate taxes an shipping costs
  // return information needed for completeshippingcontactselection()
  // https://developer.apple.com/documentation/applepayontheweb/applepaysession/completeshippingcontactselection
  // return type https://developer.apple.com/documentation/applepayontheweb/applepayshippingcontactupdate

  const selectedShippingMethod = shippingMethods[0]; // for demo purposes, select the first shipping method available
  const productsCost = 10; // for demo purposes, fixed products cost
  const shippingCost = parseFloat(selectedShippingMethod.amount);
  const tax = 1.99; // for demo purposes, fixed tax amount

  const total = productsCost + shippingCost + tax;

  const updatedBasketState = await Promise.resolve({
    newTotal: {
      label: "Demo (Card is not charged)",
      //   amount: 15.99, // ❌ amount should be string
      amount: total.toFixed(2),
    },
    newLineItems: [
      { label: "Subtotal", amount: productsCost.toFixed(2) },
      { label: "Regular Shipping", amount: shippingCost.toFixed(2) },
      { label: "Tax", amount: tax.toFixed(2) },
    ],
    // selectedShippingMethodId: "standard_home_delivery", // return the selected shipping method id to be used in onshippingmethodselected
    // first shipping method in the list considered as used one for delivery
    newShippingMethods: shippingMethods,
  });

  return updatedBasketState;
}
