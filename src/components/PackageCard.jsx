
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

function PackageCard({ packageData }) {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cartItems } = useBooking();
  const { isLoggedIn, hasRegisteredUsers } = useAuth();

  const isSelected = cartItems?.some(
    (item) => item.id === packageData.id
  );

  const handleSelect = () => {
    if (isSelected) {
      removeFromCart(packageData.id);
      return;
    }

    if (!isLoggedIn) {
      navigate(
        hasRegisteredUsers ? "/login" : "/signup",
        {
          state: {
            from: `/package/${packageData.id}`
          }
        }
      );
      return;
    }

    addToCart(packageData, 1);
  };

  return (
    <div
      className={`package-card ${
        isSelected ? "selected-package" : ""
      }`}
    >
      {isSelected && (
        <div className="selected-tick">✓</div>
      )}

      {packageData.image && (
        <img
          src={packageData.image}
          alt={`${packageData.destination} travel package`}
          loading="lazy"
          decoding="async"
          width="400"
          height="250"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover"
          }}
        />
      )}

      <div className="package-category">
        {packageData.category}
      </div>

      <h2>{packageData.title}</h2>

      <p>
        📍 {packageData.destination}
        {packageData.location
          ? ` • ${packageData.location}`
          : ""}
      </p>

      <p>⏱️ {packageData.duration} days</p>

      <p>
        ⭐ {packageData.rating} &nbsp;•&nbsp; ₹
        {packageData.price} / person
      </p>

      <div>
        <Link
          to={`/package/${packageData.id}`}
          className="button secondary-button"
        >
          View Details
        </Link>

        <button
          className="button"
          onClick={handleSelect}
        >
          {isSelected
            ? "Unselect Package"
            : isLoggedIn
              ? "Select Package"
              : "Login to Book"}
        </button>
      </div>
    </div>
  );
}

export default PackageCard;
