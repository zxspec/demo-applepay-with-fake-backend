export async function validateMerchant(validationURL) {
  const initiativeContext = window.location.hostname;
  const startSessionURL = `https://localhost:3000/api/start-session?validationURL=${validationURL}&initiativeContext=${initiativeContext}`;

  const merchantSession = await fetch(startSessionURL);
  console.log("### merchantSession: ", merchantSession);
  return merchantSession;
}

export function onApplePayButtonClicked() {
  if (!ApplePaySession) {
    return;
  }

  // Define ApplePayPaymentRequest
  // https://developer.apple.com/documentation/applepayontheweb/applepaypaymentrequest
  const request = {
    countryCode: "US",
    currencyCode: "USD",
    merchantCapabilities: ["supports3DS"],
    supportedNetworks: ["visa", "masterCard", "amex", "discover"],
    // requiredShippingContactFields: ["email"],
    // requiredShippingContactFields: ["postalAddress", "email", "name", "phone"],
    total: {
      label: "Demo (Card is not charged)",
      type: "final",
      amount: "10.00",
    },

    // Set the shipping type, for the UI it means another type of icon in shipping address.
    // shippingType: "storePickup",
    // shippingType: "servicePickup",
    // shippingType: "delivery",
    shippingType: "shipping",

    // Set the required shipping contact fields to display the pickup address.
    requiredShippingContactFields: [
      "postalAddress",
      "email",
      "phone",
      // "name",
      // "phoneticName",
    ],

    // Set the shipping contact to the pickup location.
    // If no shipping contact is set, ApplePay would automatically trigger onshippingcontactselected()
    shippingContact: {
      addressLines: ["123 Any Street"],
      locality: "Any Town",
      administrativeArea: "CA",
      postalCode: "95014",
      countryCode: "US",
      familyName: "COMPANY, INC.",
    },

    // Set the shipping contact available for editing.
    shippingContactEditingMode: "available",
    // Set the shipping contact information to read-only.
    // shippingContactEditingMode: "storePickup",
    supportedCountries: ["US", "CA"],
    supportsCouponCode: true,
  };

  // Create ApplePaySession
  const session = new ApplePaySession(3, request);

  session.onvalidatemerchant = async (event) => {
    const validationURL = event.validationURL;
    // Call your own server to request a new merchant session.
    const merchantSessionResponse = await validateMerchant(validationURL);

    const merchantSession = await merchantSessionResponse.json();

    session.completeMerchantValidation(merchantSession);
  };

  session.onshippingcontactselected = async (event) => {
    // Define ApplePayShippingContactUpdate based on the selected shipping contact.
    console.log("### shipping contact selected: ", event.shippingContact);

    const updateShippingAddressResponse = await fetch(
      `https://localhost:3000/api/shipping-address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event.shippingContact),
      }
    );
    // TODO catch errors and add client side errors
    const { newShippingMethods, newTotal, newLineItems } =
      await updateShippingAddressResponse.json();

    session.completeShippingContactSelection({
      newTotal,
      newLineItems,
      newShippingMethods,
    });
  };

  session.onshippingmethodselected = async (event) => {
    // Define ApplePayShippingMethodUpdate based on the selected shipping method.
    // No updates or errors are needed, pass an empty object.
    console.log("### shipping method selected: ", event.shippingMethod);

    const updateShippingMethodResponse = await fetch(
      `https://localhost:3000/api/shipping-method`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event.shippingMethod),
      }
    );
    // TODO catch errors and add client side errors
    const { newTotal, newLineItems } =
      await updateShippingMethodResponse.json();

    session.completeShippingMethodSelection({
      newTotal,
      newLineItems,
    });
  };

  session.onpaymentauthorized = async (event) => {
    const { payment } = event;

    const { shippingContact, billingContact, token } = payment;
    console.log("### a complete shipping address: ", shippingContact);
    console.log("### a complete billing contact: ", billingContact);
    // TODO add client side validation if needed (shipping address, etc.)

    // in case you are not PCI-compliant you, can send token directly to your PSP from the client or your backend
    // in case you are PCI-compliant you can send token to your backend and decrypt it there to get payment details

    const paymentAuthorizationResponse = await fetch(
      `https://localhost:3000/api/payment-authorization`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payment),
      }
    );

    const { success, errors = [] } = await paymentAuthorizationResponse.json();

    if (success) {
      session.completePayment({ status: ApplePaySession.STATUS_SUCCESS });
      // transit to "success" page?
      window.location.href = "/success.html";
    } else {
      // for some errors insufficient funds, risk check failed, etc.) customer could not fix anything in the UI.
      // for those scenarios set ApplePaySession.STATUS_FAILURE, which would close the Apple Pay sheet.
      // for some errors (shipping address error, etc.) add errors array and status: ApplePaySession.STATUS_SUCCESS and error details in the errors array
      // for those scenarios set ApplePaySession.STATUS_SUCCESS, it would prevent Apple Pay sheet from closing.
      // while customer see error fileds and fix them in the UI.
      const hasFatalError = errors.some((error) => error.isFatal);

      if (hasFatalError) {
        session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
      } else {
        const applePayErrors = errors.map((error) => {
          if (error.code === "shipping_address_unserviceable") {
            return new ApplePayError("shippingContactInvalid");
          }
          if (error.code === "billing_address_invalid") {
            return new ApplePayError("billingContactInvalid");
          }
          // add more error codes as needed
        });
        session.completePayment({
          status: ApplePaySession.STATUS_SUCCESS,
          errors: applePayErrors,
        });
      }
    }
  };

  session.oncouponcodechanged = async (event) => {
    const couponCode = event.couponCode;
    console.log("### coupon code changed: ", couponCode);

    let result;

    if (couponCode) {
      result = await fetch(`https://localhost:3000/api/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode }),
      });
    } else {
      result = await fetch(`https://localhost:3000/api/coupon`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const {
      newShippingMethods,
      newTotal,
      newLineItems,
      errors = [],
    } = await result.json();

    const applePayErrors = errors.map((error) => {
      if (error.code === "invalid_coupon") {
        return new ApplePayError("couponCodeInvalid");
      }

      return new ApplePayError(
        "unknown" // use "unknown" for custom errors
      );
    });

    session.completeCouponCodeChange({
      newShippingMethods,
      newTotal,
      newLineItems,
      errors: applePayErrors,
    });
  };

  session.onpaymentmethodselected = async (event) => {
    // Define ApplePayPaymentMethodUpdate based on the selected payment method.
    // No updates or errors are needed, pass an empty object.
    console.log("### selected payment method: ", event.paymentMethod);
    const paymentMethodUpdateResponse = await fetch(
      `https://localhost:3000/api/payment-method`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event.paymentMethod),
      }
    );

    const update = await paymentMethodUpdateResponse.json();

    session.completePaymentMethodSelection(update);
  };

  session.oncancel = (event) => {
    // Payment canceled by WebKit
    console.log("### oncancel event: ", event);
    // TODO add tracking if needed
  };

  // exactly this line makes Apple Pay UI appear
  session.begin();
}
