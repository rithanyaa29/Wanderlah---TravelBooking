
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createBooking } from "../api/api";

import {
  confirmBooking,
  selectPackageCost,
  selectDiscount,
  selectTaxes,
  selectFinalAmount,
  selectTravelerCount
} from "../store/bookingSlice";


function BookingPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    cartItems,
    travelDates,
    travelerDetails
  } = useSelector((state) => state.booking);

  const packageCost = useSelector(selectPackageCost);
  const discount = useSelector(selectDiscount);
  const taxes = useSelector(selectTaxes);
  const finalAmount = useSelector(selectFinalAmount);
  const travelerCount = useSelector(selectTravelerCount);

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
  const handlePayment = async (e) => {
  e.preventDefault();

  if (!paymentMethod) {
    setError("Please select a payment method.");
    return;
  }

  if (cartItems.length === 0) {
    setError("Please select a package before booking.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const bookingData = {
      packages: cartItems,
      travelDates,
      travelerDetails,
      travelerCount,
      packageCost,
      discount,
      taxes,
      finalAmount,
      paymentMethod
    };

    // Send a real HTTP POST request
    const result = await createBooking(bookingData);

    // Save the backend response in Redux
    dispatch(confirmBooking(result.booking));

    alert("Booking confirmed successfully!");

    navigate("/bookings");
} catch (err) {
  console.error("Booking creation failed:", err);

  if (err.response?.status === 401 ||
      err.response?.status === 403) {
    setError("Your session is invalid or has expired. Please log in again.");
  } else {
    setError(
      err.response?.data?.message ||
      "Unable to create booking. Please try again."
    );
  }
} finally {
  setLoading(false);
}
};
  return (
    <div className="booking-step">

      <h2>4. Payment</h2>

      <p>
        Select a payment method to complete your booking.
      </p>

      <h3>
        Amount to Pay: ₹{finalAmount}
      </h3>

      <form onSubmit={handlePayment}>

        <div className="payment-method">

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            UPI
          </label>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            Credit / Debit Card
          </label>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Net Banking"
              checked={paymentMethod === "Net Banking"}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            />

            Net Banking
          </label>

        </div>

       <button
  type="submit"
  className="button"
  disabled={loading}
>
  {loading ? "Processing..." : "Pay & Confirm Booking"}
</button>

{error && (
  <p className="form-error" role="alert">
    {error}
  </p>
)}
      </form>

    </div>
  );
}

export default BookingPayment;