const now = Date.now();
const MILISECOND_IN_A_DAY = 24 * 60 * 60 * 1000;
const homeDeliveryStartDate = new Date(now + 3 * MILISECOND_IN_A_DAY);
const homeDeliveryEndDate = new Date(now + 5 * MILISECOND_IN_A_DAY);

export const shippingMethods = [
  {
    identifier: "standard_home_delivery",
    label: "Standard Home Delivery",
    detail: "Arrives in 3-5 days",
    amount: "4.00",
    dateComponentsRange: {
      startDateComponents: {
        years: homeDeliveryStartDate.getFullYear(),
        months: homeDeliveryStartDate.getMonth() + 1,
        days: homeDeliveryStartDate.getDate(),
        hours: 9,
      },
      endDateComponents: {
        years: homeDeliveryEndDate.getFullYear(),
        months: homeDeliveryEndDate.getMonth() + 1,
        days: homeDeliveryEndDate.getDate(),
        hours: 12,
      },
    },
  },
  {
    identifier: "express_home_delivery",
    label: "Express Home Delivery",
    detail: "Arrives in 1-2 days",
    amount: "8.00",
    // selected: true,
    // dateComponentsRange: {
    //   start: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    //   end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    // },
  },
];

export const stateBeforeCouponApplied = {
  newTotal: {
    label: "Demo (Card is not charged)",
    amount: "15.99",
  },
  newLineItems: [
    { label: "Subtotal", amount: "10.00" },
    { label: "Shipping", amount: "4.00" },
    { label: "Tax", amount: "1.99" },
  ],
  newShippingMethods: shippingMethods,
};
