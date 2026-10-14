import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectPackageCost,
  selectDiscount,
  selectTaxes,
  selectFinalAmount,
  selectTravelerCount
} from "../store/bookingSlice";

import TravelerCard from "./TravelerCard.jsx";


function BookingSummary() {

  const navigate = useNavigate();


  // Get booking data from Redux
  const {
    cartItems,
    travelDates,
    travelerDetails
  } = useSelector(
    (state) => state.booking
  );


  // Get calculated values from Redux selectors
  const packageCost = useSelector(
    selectPackageCost
  );

  const discount = useSelector(
    selectDiscount
  );

  const taxes = useSelector(
    selectTaxes
  );

  const finalAmount = useSelector(
    selectFinalAmount
  );

  const travelerCount = useSelector(
    selectTravelerCount
  );


  // Continue to payment
  const handleContinue = () => {

    navigate(
      "/booking/payment"
    );

  };


  return (

    <div className="booking-step">

      <h2>
        3. Booking Summary
      </h2>


      {/* SELECTED PACKAGES */}

      <section>

        <h3>
          Selected Packages
        </h3>


        {cartItems.map((item) => (

          <div
            key={item.id}
            className="summary-item"
          >

            <h4>
              {item.title}
            </h4>

            <p>
              Destination:{" "}
              {item.destination}
            </p>

            <p>
              Duration:{" "}
              {item.duration} days
            </p>

            <p>
              Travelers:{" "}
              {item.travelers}
            </p>

            <p>
              Amount: ₹
              {Number(
                item.total
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </section>


      {/* TRAVEL INFORMATION */}

      <section>

        <h3>
          Travel Information
        </h3>

        <p>
          Start Date:{" "}
          {travelDates.startDate}
        </p>

        <p>
          End Date:{" "}
          {travelDates.endDate}
        </p>

        <p>
          Total Travelers:{" "}
          {travelerCount}
        </p>

      </section>


      {/* TRAVELER INFORMATION */}

      <section>

        <h3>
          Traveler Information
        </h3>

        <TravelerCard
          traveler={travelerDetails}
        />

      </section>


      {/* PAYMENT SUMMARY */}

      <section>

        <h3>
          Payment Summary
        </h3>

        <p>
          Package Cost: ₹
          {packageCost.toLocaleString()}
        </p>

        <p>
          Discount: ₹
          {discount.toLocaleString()}
        </p>

        <p>
          Taxes: ₹
          {taxes.toLocaleString()}
        </p>

        <hr />

        <h2>
          Final Amount: ₹
          {finalAmount.toLocaleString()}
        </h2>

      </section>


      <button
        className="button"
        onClick={handleContinue}
      >
        Continue to Payment
      </button>

    </div>

  );

}
export default BookingSummary;