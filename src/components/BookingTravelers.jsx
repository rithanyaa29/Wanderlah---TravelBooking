import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

function BookingTravelers() {
  const navigate = useNavigate();

  const {
    travelers,
    setTravelers,
    travelerDetails,
    setTravelerDetails,
  } = useOutletContext();

  const handleChange = (e) => {
    setTravelerDetails({
      ...travelerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (
      !travelerDetails.name ||
      !travelerDetails.email ||
      !travelerDetails.phone
    ) {
      alert("Please fill all traveler details.");
      return;
    }

    if (travelers < 1) {
      alert("Number of travelers must be at least 1.");
      return;
    }

    navigate("/booking/summary");
  };

  return (
    <div className="booking-page">

      <h2>Traveler Details</h2>

      <form onSubmit={handleContinue}>

        <label>
          Full Name
        </label>

        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={travelerDetails.name}
          onChange={handleChange}
        />

        <label>
          Email Address
        </label>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={travelerDetails.email}
          onChange={handleChange}
        />

        <label>
          Phone Number
        </label>

        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={travelerDetails.phone}
          onChange={handleChange}
        />

        <label>
          Number of Travelers
        </label>

        <input
          type="number"
          min="1"
          value={travelers}
          onChange={(e) =>
            setTravelers(Number(e.target.value))
          }
        />

        <button
          className="button"
          type="submit"
        >
          Continue
        </button>

      </form>

    </div>
  );
}
export default BookingTravelers;