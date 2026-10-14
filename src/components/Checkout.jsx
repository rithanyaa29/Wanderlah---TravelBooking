import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectPackageCost,
  selectDiscount,
  selectTaxes,
  selectFinalAmount
} from "../store/bookingSlice";

function Checkout() {
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.booking.cartItems
  );

  const packageCost = useSelector(selectPackageCost);
  const discount = useSelector(selectDiscount);
  const taxes = useSelector(selectTaxes);
  const finalAmount = useSelector(selectFinalAmount);

  if (cartItems.length === 0) {
    return (
      <div className="checkout">

        <h1>Checkout</h1>

        <p>
          Your booking cart is empty.
        </p>

        <button
          className="button"
          onClick={() => navigate("/packages")}
        >
          Explore Packages
        </button>

      </div>
    );
  }

  return (
    <div className="checkout">

      <h1>Checkout</h1>

      <p>
        Review your booking before entering
        traveler details.
      </p>

      <div className="booking-summary">

        <h2>Booking Summary</h2>

        <p>
          Package Cost: ₹{packageCost}
        </p>

        <p>
          Discount: ₹{discount}
        </p>

        <p>
          Taxes: ₹{taxes}
        </p>

        <hr />

        <h2>
          Final Amount: ₹{finalAmount}
        </h2>

      </div>

      <button
        className="button"
        onClick={() => navigate("/traveler")}
      >
        Continue to Traveler Details
      </button>

    </div>
  );
}

export default Checkout;