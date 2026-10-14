
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchPackageById } from "../api/api";

import {
  addToCart,
  cachePackage
} from "../store/bookingSlice";

import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn } = useAuth();

  // Get this package from the Redux cache
  const cachedPackage = useSelector(
    (state) => state.booking.packageCache[id]
  );

  const [packageData, setPackageData] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPackage = async () => {
      try {
        setLoading(true);
        setError("");

      // First check Redux cache
if (cachedPackage) {

  setPackageData(cachedPackage);
  return;
}

        // If not cached, fetch from API
        const data = await fetchPackageById(id);

        if (cancelled) return;

        setPackageData(data);

        // Save the result in Redux cache
        dispatch(cachePackage(data));
      } catch (err) {
        console.error("Error fetching package:", err);

        if (!cancelled) {
          setError(
            "Unable to load package details. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPackage();

    return () => {
      cancelled = true;
    };
  }, [id, cachedPackage, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main className="error-page">
        <h2>Unable to Load Package</h2>
        <p>{error}</p>
      </main>
    );
  }

  if (!packageData) {
    return (
      <main className="error-page">
        <h2>Package Not Found</h2>
        <p>The requested travel package does not exist.</p>
      </main>
    );
  }

  const packageCost =
    Number(packageData.price) * Number(travelers);

  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: `/package/${packageData.id}`
        }
      });
      return;
    }

    dispatch(
      addToCart({
        packageData,
        travelers
      })
    );

    navigate("/booking/dates");
  };

  return (
    <main className="package-detail-page">
      <section className="package-detail">

        <div className="package-detail-header">
          <p>{packageData.category}</p>

          <h1>{packageData.title}</h1>

          <h3>
            📍 {packageData.location}, {packageData.destination}
          </h3>
        </div>

        <div className="package-detail-info">
          <p>
            <strong>Duration:</strong>{" "}
            {packageData.duration} days
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            ⭐ {packageData.rating}
          </p>

          <p>
            <strong>Price per person:</strong>{" "}
            ₹{packageData.price}
          </p>
        </div>

        <section>
          <h2>About This Package</h2>
          <p>{packageData.description}</p>
        </section>

        <section>
          <h2>Itinerary</h2>
          <ul>
            {packageData.itinerary?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Inclusions</h2>
          <ul>
            {packageData.inclusions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Exclusions</h2>
          <ul>
            {packageData.exclusions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="booking-box">
          <h2>Book This Package</h2>

          <label>
            Number of Travelers
          </label>

          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) =>
              setTravelers(
                Math.max(1, Number(e.target.value))
              )
            }
          />

          <p>
            <strong>Package Cost:</strong>{" "}
            ₹{packageCost}
          </p>

          <button
            className="button"
            onClick={handleBookNow}
          >
            Select Package
          </button>
        </section>

      </section>
    </main>
  );
}

export default PackageDetail;
