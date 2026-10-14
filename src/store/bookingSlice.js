import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPackage: null,

  travelDates: {
    startDate: "",
    endDate: ""
  },

  travelers: 1,

  travelerDetails: {
    name: "",
    email: "",
    phone: ""
  },

  cartItems: [],

  bookingHistory: [],

  bookingInfo: null,

  packageCache: {}
};

const bookingSlice = createSlice({
  name: "booking",

  initialState,

  reducers: {

    // Select a package
    setSelectedPackage: (state, action) => {
      state.selectedPackage = action.payload;
    },


    // Set travel dates
    setTravelDates: (state, action) => {
      state.travelDates = action.payload;
    },


    // Set number of travelers
    setTravelers: (state, action) => {
      state.travelers = Number(action.payload);
    },


    // Set traveler information
    setTravelerDetails: (state, action) => {
      state.travelerDetails = action.payload;
    },


    // Add package to booking cart
    addToCart: (state, action) => {

      const {
        packageData,
        travelers
      } = action.payload;

      const travelerCount = Number(travelers);

      state.selectedPackage = packageData;

      const existingItem = state.cartItems.find(
        (item) => item.id === packageData.id
      );

      if (existingItem) {

        existingItem.travelers = travelerCount;

        existingItem.total =
          Number(existingItem.price) *
          travelerCount;

      } else {

        state.cartItems.push({
          ...packageData,

          travelers: travelerCount,

          total:
            Number(packageData.price) *
            travelerCount
        });
      }
    },


    // Update travelers for a cart item
    updateCartItem: (state, action) => {

      const {
        id,
        travelers
      } = action.payload;

      const item = state.cartItems.find(
        (item) => item.id === id
      );

      if (item) {

        const count = Math.max(
          1,
          Number(travelers)
        );

        item.travelers = count;

        item.total =
          Number(item.price) * count;
      }
    },


    // Remove package from cart
    removeFromCart: (state, action) => {

      state.cartItems =
        state.cartItems.filter(
          (item) =>
            item.id !== action.payload
        );

      if (
        state.selectedPackage &&
        state.selectedPackage.id === action.payload
      ) {
        state.selectedPackage = null;
      }
    },


    // Clear entire cart
    clearCart: (state) => {

      state.cartItems = [];

      state.selectedPackage = null;

      state.travelDates = {
        startDate: "",
        endDate: ""
      };

      state.travelers = 1;

      state.travelerDetails = {
        name: "",
        email: "",
        phone: ""
      };
    },


    // Save confirmed booking
    confirmBooking: (state, action) => {

      const booking = action.payload;

      state.bookingHistory.push(
        booking
      );

      state.bookingInfo = booking;

      state.cartItems = [];

      state.selectedPackage = null;
    },


    // Cancel booking
    cancelBooking: (state, action) => {

      const booking = state.bookingHistory.find(
        (booking) =>
          booking.id === action.payload
      );

      if (booking) {
        booking.status = "Cancelled";
      }
    },


    // Cache package information
    cachePackage: (state, action) => {

      const packageData = action.payload;

      state.packageCache[
        packageData.id
      ] = packageData;
    },
    // Clear cached packages
    clearPackageCache: (state) => {

      state.packageCache = {};
    },
    // Load booking history
    setBookingHistory: (state, action) => {

      state.bookingHistory = action.payload;
    }

  }
});
// Export actions
export const {
  setSelectedPackage,
  setTravelDates,
  setTravelers,
  setTravelerDetails,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  confirmBooking,
  cancelBooking,
  cachePackage,
  clearPackageCache,
  setBookingHistory
} = bookingSlice.actions;
// Package cost
export const selectPackageCost = (state) => {

  return state.booking.cartItems.reduce(
    (total, item) =>
      total + Number(item.total || 0),
    0
  );
};
// Discount
export const selectDiscount = (state) => {

  const packageCost =
    selectPackageCost(state);

  if (packageCost >= 50000) {
    return packageCost * 0.10;
  }

  if (packageCost >= 30000) {
    return packageCost * 0.05;
  }

  return 0;
};
// Tax
export const selectTaxes = (state) => {

  const packageCost =
    selectPackageCost(state);

  const discount =
    selectDiscount(state);

  return (
    packageCost - discount
  ) * 0.05;
};
// Final amount
export const selectFinalAmount = (state) => {

  const packageCost =
    selectPackageCost(state);

  const discount =
    selectDiscount(state);

  const taxes =
    selectTaxes(state);

  return (
    packageCost -
    discount +
    taxes
  );
};
// Traveler count
export const selectTravelerCount = (state) => {

  return state.booking.cartItems.reduce(
    (total, item) =>
      total + Number(item.travelers || 0),
    0
  );
};
// Export reducer
export default bookingSlice.reducer;