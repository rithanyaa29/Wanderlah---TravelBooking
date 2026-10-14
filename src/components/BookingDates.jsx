import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setTravelDates
} from "../store/bookingSlice";

import {
  fetchAvailability
} from "../api/api";

import DatePicker from "./DatePicker";
import Button from "./Button";
import Loading from "./Loading";


function BookingDates() {

  const navigate = useNavigate();

  const dispatch = useDispatch();


  // Get Redux booking data
  const {
    cartItems,
    travelDates
  } = useSelector(
    (state) => state.booking
  );


  // First package in cart
  const selectedPackage =
    cartItems[0];


  const [availability, setAvailability] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // Check package availability
  useEffect(() => {

    if (!selectedPackage) {
      return;
    }


    const checkAvailability =
      async () => {

        try {

          setLoading(true);

          setError("");


          const data =
            await fetchAvailability(
              selectedPackage.id
            );


          setAvailability(data);

        } catch (err) {

          console.error(err);

          setError(
            "Unable to check package availability."
          );

        } finally {

          setLoading(false);

        }

      };


    checkAvailability();

  }, [selectedPackage]);


  // Handle date selection
  const handleDateChange = (date) => {

    if (!date) {
      return;
    }


    const startDate =
      date;


    // Find the longest package duration
    const longestDuration =
      cartItems.reduce(
        (longest, item) =>
          Math.max(
            longest,
            Number(item.duration) || 1
          ),
        1
      );


    // Calculate end date
    const endDate =
      new Date(startDate);


    endDate.setDate(
      endDate.getDate() +
      longestDuration - 1
    );


    const formattedEndDate =
      endDate
        .toISOString()
        .split("T")[0];


    // Save dates in Redux
    dispatch(
      setTravelDates({
        startDate,
        endDate: formattedEndDate
      })
    );

  };


  // Continue to traveler details
  const handleContinue = () => {


    if (!selectedPackage) {

      alert(
        "Please select a travel package first."
      );

      navigate("/packages");

      return;
    }


    if (!travelDates.startDate) {

      alert(
        "Please select a travel date."
      );

      return;
    }


    if (
      availability &&
      !availability.available
    ) {

      alert(
        "This package is currently unavailable."
      );

      return;
    }


    navigate(
      "/booking/travelers"
    );

  };


  // No package selected
  if (!selectedPackage) {

    return (

      <div className="booking-step">

        <h2>
          1. Select Travel Date
        </h2>

        <p>
          Please select a travel package
          before choosing your travel date.
        </p>

        <Button
          onClick={() =>
            navigate("/packages")
          }
        >
          Browse Packages
        </Button>

      </div>

    );

  }


  // Loading availability
  if (loading) {

    return <Loading />;

  }


  // Availability error
  if (error) {

    return (

      <div className="booking-step error-page">

        <h2>
          Unable to Check Availability
        </h2>

        <p>
          {error}
        </p>

      </div>

    );

  }


  return (

    <div className="booking-step">


      <h2>
        1. Select Travel Date
      </h2>



      {/* AVAILABILITY */}

      <section className="availability-box">


        <h3>
          {availability?.packageTitle}
        </h3>


        <p>

          <strong>
            Destination:
          </strong>{" "}

          {availability?.destination}

        </p>


        <p>

          <strong>
            Available Seats:
          </strong>{" "}

          {availability?.availableSeats}

        </p>


        <p>

          <strong>
            Status:
          </strong>{" "}

          {availability?.available
            ? "Available"
            : "Not Available"}

        </p>


        <p>
          {availability?.message}
        </p>


      </section>



      {/* DATE SELECTION */}

      {availability?.available && (

        <>

          <p>
            Choose the starting date
            for your trip.
          </p>


          <DatePicker
            label="Travel Date"

            value={
              travelDates.startDate
            }

            onChange={(e) =>
              handleDateChange(
                e.target.value
              )
            }
          />


          {travelDates.endDate && (

            <p>

              <strong>
                End Date:
              </strong>{" "}

              {travelDates.endDate}

            </p>

          )}


          <Button
            onClick={handleContinue}
          >
            Continue to Traveler Details
          </Button>


        </>

      )}

    </div>

  );

}
export default BookingDates;