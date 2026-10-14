import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  setTravelerDetails
} from "../store/bookingSlice";

import Input from "./Input";
import Button from "./Button";


function TravelerForm() {

  const navigate = useNavigate();

  const dispatch = useDispatch();


  // Get booking data from Redux
  const {
    travelerDetails,
    cartItems
  } = useSelector(
    (state) => state.booking
  );


  // Update traveler details
  const handleChange = (e) => {

    dispatch(
      setTravelerDetails({
        ...travelerDetails,
        [e.target.name]: e.target.value
      })
    );

  };


  // Continue to booking summary
  const handleContinue = (e) => {

    e.preventDefault();


    // Check package
    if (cartItems.length === 0) {

      alert(
        "Please select a package first."
      );

      navigate("/packages");

      return;
    }


    // Validate name
    if (!travelerDetails.name.trim()) {

      alert(
        "Please enter your name."
      );

      return;
    }


    // Validate email
    if (!travelerDetails.email.trim()) {

      alert(
        "Please enter your email."
      );

      return;
    }


    // Validate email format
    if (
      !/^\S+@\S+\.\S+$/.test(
        travelerDetails.email
      )
    ) {

      alert(
        "Please enter a valid email address."
      );

      return;
    }


    // Validate phone
    if (!travelerDetails.phone.trim()) {

      alert(
        "Please enter your phone number."
      );

      return;
    }


    // Validate 10 digit phone
    if (
      !/^\d{10}$/.test(
        travelerDetails.phone
      )
    ) {

      alert(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }


    // Go to summary
    navigate(
      "/booking/summary"
    );

  };


  return (

    <div className="booking-step">

      <h2>
        2. Traveler Details
      </h2>


      <form
        onSubmit={handleContinue}
      >

        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={travelerDetails.name}
          onChange={handleChange}
          required
        />


        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={travelerDetails.email}
          onChange={handleChange}
          required
        />


        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={travelerDetails.phone}
          onChange={handleChange}
          required
        />


        <Button type="submit">
          Continue
        </Button>

      </form>

    </div>

  );

}


export default TravelerForm;