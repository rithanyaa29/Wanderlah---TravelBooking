
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  fetchBookings,
  patchBooking,
  deleteBooking
} from "../api/api";

import {
  updateCartItem,
  removeFromCart,
  clearCart,
  setBookingHistory,
  selectPackageCost,
  selectDiscount,
  selectTaxes,
  selectFinalAmount
} from "../store/bookingSlice";

function BookingCart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const dispatch = useDispatch();

  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [bookingActionLoading, setBookingActionLoading] = useState(false);

  // Get booking data and calculated values from Redux
  const { cartItems, bookingHistory } = useSelector(
    (state) => state.booking
  );

  const packageCost = useSelector(selectPackageCost);
  const discount = useSelector(selectDiscount);
  const taxes = useSelector(selectTaxes);
  const finalAmount = useSelector(selectFinalAmount);

  // GET: Load booking history from the backend
  useEffect(() => {
    let cancelled = false;

    const loadBookingHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError("");

        const data = await fetchBookings();

        if (!cancelled) {
          dispatch(setBookingHistory(data));
        }
      } catch (err) {
        console.error("Failed to load booking history:", err);

        if (!cancelled) {
          setHistoryError(
            err.response?.data?.message ||
              "Unable to load booking history. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    };

    loadBookingHistory();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // PATCH: Update the traveler's name
  const handleUpdateBooking = async (booking) => {
    const currentName = booking.travelerDetails?.name || "";

    const newName = window.prompt(
      "Enter the updated traveler name:",
      currentName
    );

    if (newName === null || !newName.trim()) {
      return;
    }

    try {
      setBookingActionLoading(true);
      setHistoryError("");

      await patchBooking(booking.id, {
        travelerDetails: {
          ...booking.travelerDetails,
          name: newName.trim()
        }
      });

      const updatedHistory = await fetchBookings();
      dispatch(setBookingHistory(updatedHistory));
    } catch (err) {
      console.error("Failed to update booking:", err);

      setHistoryError(
        err.response?.data?.message ||
          "Unable to update booking. Please try again."
      );
    } finally {
      setBookingActionLoading(false);
    }
  };

  // DELETE: Delete a booking from the backend
  const handleDeleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setBookingActionLoading(true);
      setHistoryError("");

      await deleteBooking(bookingId);

      const updatedHistory = await fetchBookings();
      dispatch(setBookingHistory(updatedHistory));
    } catch (err) {
      console.error("Failed to delete booking:", err);

      setHistoryError(
        err.response?.data?.message ||
          "Unable to delete booking. Please try again."
      );
    } finally {
      setBookingActionLoading(false);
    }
  };

  // Hide cancelled bookings
  const visibleBookings = bookingHistory.filter(
    (booking) => booking.status !== "Cancelled"
  );

  return (
    <main className="booking-cart">
      {/* PAGE HEADING */}
      <section className="booking-page-heading">
        <p className="page-eyebrow">YOUR TRAVEL SPACE</p>

        <h1>My Bookings</h1>

        <p>
          Welcome, {currentUser?.username}.
          Manage your selected packages and confirmed trips here.
        </p>
      </section>

      {/* CURRENT CART */}
      <section className="current-cart">
        <div className="booking-section-heading">
          <div>
            <p>READY TO BOOK</p>
            <h2>Selected Packages</h2>
          </div>

          <button
            type="button"
            className="small-outline-button"
            onClick={() => navigate("/packages")}
          >
            + Add Package
          </button>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🧳</div>

            <h3>Your booking cart is empty</h3>

            <p>
              Explore our destinations and select a package when
              you are ready to plan your trip.
            </p>

            <button
              type="button"
              className="button"
              onClick={() => navigate("/packages")}
            >
              Explore Packages
            </button>
          </div>
        ) : (
          <>
            {/* CART ITEMS */}
            {cartItems.map((item) => (
              <div className="booking-package" key={item.id}>
                {/* PACKAGE INFORMATION */}
                <div className="booking-package-main">
                  <span className="package-mini-category">
                    {item.category}
                  </span>

                  <h3>{item.title}</h3>

                  <p>
                    📍 {item.destination} • {item.location}
                  </p>

                  <p>
                    ₹{Number(item.price).toLocaleString()} / person
                  </p>
                </div>

                {/* TRAVELER CONTROL */}
                <div className="traveler-control">
                  <label htmlFor={`travelers-${item.id}`}>
                    Travelers
                  </label>

                  <input
                    id={`travelers-${item.id}`}
                    type="number"
                    min="1"
                    value={item.travelers}
                    onChange={(e) =>
                      dispatch(
                        updateCartItem({
                          id: item.id,
                          travelers: e.target.value
                        })
                      )
                    }
                  />
                </div>

                {/* ITEM TOTAL */}
                <div className="booking-item-total">
                  <span>Total</span>

                  <strong>
                    ₹{Number(item.total).toLocaleString()}
                  </strong>
                </div>

                {/* REMOVE FROM CART */}
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* BOOKING SUMMARY */}
            <div className="booking-summary">
              <div>
                <p>
                  Package Cost
                  <span>₹{packageCost.toLocaleString()}</span>
                </p>

                <p>
                  Discount
                  <span>₹{discount.toLocaleString()}</span>
                </p>

                <p>
                  Taxes
                  <span>₹{taxes.toLocaleString()}</span>
                </p>
              </div>

              <hr />

              <h2>
                <span>Final Amount</span>
                <strong>₹{finalAmount.toLocaleString()}</strong>
              </h2>

              {/* CART BUTTONS */}
              <div className="cart-buttons">
                <button
                  type="button"
                  className="button secondary-button"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear Cart
                </button>

                <button
                  type="button"
                  className="button"
                  onClick={() => navigate("/booking/dates")}
                >
                  Continue Booking →
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* BOOKING HISTORY */}
      <section className="booking-history">
        <div className="booking-section-heading">
          <div>
            <p>YOUR TRIPS</p>
            <h2>Confirmed Bookings</h2>
          </div>
        </div>

        {historyLoading && <p>Loading booking history...</p>}

        {historyError && (
          <p className="form-error" role="alert">
            {historyError}
          </p>
        )}

        {/* Show empty state only after GET finishes successfully */}
        {!historyLoading &&
          !historyError &&
          visibleBookings.length === 0 && (
            <div className="empty-cart history-empty">
              <div className="empty-icon">🌿</div>

              <h3>No confirmed bookings yet</h3>

              <p>
                Your confirmed bookings will appear here after
                you complete the booking process.
              </p>
            </div>
          )}

        {/* SHOW BOOKINGS */}
        {!historyLoading &&
          visibleBookings.map((booking, index) => (
            <div className="confirmed-booking" key={booking.id}>
              {/* BOOKING HEADER */}
              <div className="booking-history-top">
                <div>
                  <span className="confirmed-badge">
                    {booking.status || "Confirmed"}
                  </span>

                  <h3>Booking {index + 1}</h3>
                </div>

                <strong>
                  ₹{Number(booking.finalAmount || 0).toLocaleString()}
                </strong>
              </div>

              <h4>Packages</h4>

              {/* BOOKING PACKAGES */}
              {(booking.packages || []).map((item, itemIndex) => (
                <div
                  className="history-package"
                  key={item.id ?? itemIndex}
                >
                  <p>
                    <strong>{item.title}</strong>
                  </p>

                  <p>
                    📍 {item.destination} • {item.location}
                  </p>

                  <p>Travelers: {item.travelers}</p>

                  <p>
                    Amount: ₹{Number(item.total || 0).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* BOOKING DETAILS */}
              <div className="booking-history-details">
                <p>
                  <span>Travel Dates</span>
                  <strong>
                    {booking.travelDates?.startDate || "Not specified"}
                    {" "}to{" "}
                    {booking.travelDates?.endDate || "Not specified"}
                  </strong>
                </p>

                <p>
                  <span>Traveler</span>
                  <strong>
                    {booking.travelerDetails?.name || "Not specified"}
                  </strong>
                </p>
              </div>

              {/* UPDATE AND DELETE */}
              <div className="cart-buttons">
                <button
                  type="button"
                  className="button secondary-button"
                  disabled={bookingActionLoading}
                  onClick={() => handleUpdateBooking(booking)}
                >
                  Update Traveler Name
                </button>

                <button
                  type="button"
                  className="button"
                  disabled={bookingActionLoading}
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  {bookingActionLoading
                    ? "Please wait..."
                    : "Delete Booking"}
                </button>
              </div>
            </div>
          ))}
      </section>
    </main>
  );
}

export default BookingCart;
