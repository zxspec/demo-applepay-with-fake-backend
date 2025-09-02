import { stateBeforeCouponApplied } from "./mocks.mjs";

export async function applyCoupon({ couponCode }) {
  console.log("### selected couponCode method: ", couponCode);
  // your backend needs to validate coupon and then apply it
  // coupon code could influence price of products, delivery and tax amounts
  // simulate async operation of sending coupon code to backend
  // return information needed for completecouponcodechange()
  // https://developer.apple.com/documentation/applepayontheweb/applepaysession/completecouponcodechange
  // https://developer.apple.com/documentation/applepayontheweb/applepaycouponcodeupdate

  // simulate backend coupon validation
  const isValidCoupon = couponCode === "SHIP_FREE";

  if (isValidCoupon) {
    return {
      newTotal: {
        label: "Demo (Card is not charged)",
        amount: "11.99",
      },
      newLineItems: [
        { label: "Subtotal", amount: "10.00" },
        { label: "Tax", amount: "1.99" },
      ],
      newShippingMethods: [
        {
          identifier: "standard_home_delivery",
          label: "Standard Home Delivery",
          detail: "Arrives in 3-5 days",
          amount: "0.00",
        },
      ],
    };
  }

  if (!isValidCoupon) {
    return {
      ...stateBeforeCouponApplied,
      errors: [
        {
          code: "invalid_coupon",
          message: "The coupon code is invalid.",
        },
        // new ApplePayError("couponCodeInvalid"),
      ],
    };
  }

  return updatedBasketState;
}

export async function deleteCoupon() {
  console.log("### delete coupon method called");

  return stateBeforeCouponApplied;
}
