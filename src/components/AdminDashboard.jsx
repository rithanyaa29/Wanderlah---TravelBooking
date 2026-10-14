
import { useEffect, useState } from "react";
import {
  getAdminPackages,
  addPackage,
  updatePackage,
  deletePackage,
  getAdminBookings
} from "../api/api";
import "./Admin.css";
const emptyPackage = {
  destination: "",
  location: "",
  title: "",
  duration: 3,
  price: 0,
  category: "Nature",
  rating: 4.5,
  description: "",
  itinerary: [],
  inclusions: [],
  exclusions: []
};

function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyPackage);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [packageData, bookingData] = await Promise.all([
        getAdminPackages(),
        getAdminBookings()
      ]);

      setPackages(packageData);
      setBookings(bookingData);
    } catch (error) {
      console.error("[ADMIN DASHBOARD] Load failed:", error);
      setMessage(
        error.response?.status === 401 ||
        error.response?.status === 403
          ? "Admin login required. Please log in again."
          : "Could not load dashboard. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: ["duration", "price", "rating"].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const packageData = {
        ...form,
        itinerary: Array.isArray(form.itinerary)
          ? form.itinerary
          : [],
        inclusions: Array.isArray(form.inclusions)
          ? form.inclusions
          : [],
        exclusions: Array.isArray(form.exclusions)
          ? form.exclusions
          : []
      };

      if (editingId !== null) {
        await updatePackage(editingId, packageData);
        setMessage("Package updated successfully.");
      } else {
        await addPackage(packageData);
        setMessage("Package added successfully.");
      }

      console.log("[ADMIN DASHBOARD] Package form submitted");
      setForm(emptyPackage);
      setEditingId(null);
      await loadDashboard();
    } catch (error) {
      console.error("[ADMIN DASHBOARD] Save failed:", error);
      setMessage(
        error.response?.data?.message || "Could not save package."
      );
    }
  };

  const handleEdit = (item) => {
    setForm({
      ...emptyPackage,
      ...item,
      itinerary: item.itinerary || [],
      inclusions: item.inclusions || [],
      exclusions: item.exclusions || []
    });

    setEditingId(item.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return;
    }

    try {
      await deletePackage(id);
      setMessage("Package deleted successfully.");
      await loadDashboard();
    } catch (error) {
      console.error("[ADMIN DASHBOARD] Delete failed:", error);
      setMessage(
        error.response?.data?.message || "Could not delete package."
      );
    }
  };

  const cancelEdit = () => {
    setForm(emptyPackage);
    setEditingId(null);
    setMessage("");
  };

  if (loading && packages.length === 0 && bookings.length === 0) {
    return <main className="admin-dashboard"><p>Loading dashboard...</p></main>;
  }

  return (
    <main className="admin-dashboard">
      <h1>TourBooking Admin Dashboard</h1>
      <p>Manage travel packages and monitor bookings.</p>

      {message && <p role="status">{message}</p>}

      <section className="admin-stats">
        <article>
          <h2>{packages.length}</h2>
          <p>Total packages</p>
        </article>
        <article>
          <h2>{bookings.length}</h2>
          <p>Total bookings</p>
        </article>
        <article>
          <h2>
            {bookings.filter(
              (booking) => booking.status === "Confirmed"
            ).length}
          </h2>
          <p>Confirmed bookings</p>
        </article>
        <article>
          <h2>
            {bookings.filter(
              (booking) => booking.status === "Cancelled"
            ).length}
          </h2>
          <p>Cancelled bookings</p>
        </article>
      </section>

      <section className="admin-section">
        <h2>{editingId !== null ? "Edit Package" : "Add New Package"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Package title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Destination
            <input
              name="destination"
              value={form.destination}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Duration (days)
            <input
              type="number"
              name="duration"
              min="1"
              value={form.duration}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price (₹)
            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Rating
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">
            {editingId !== null ? "Save Changes" : "Add Package"}
          </button>

          {editingId !== null && (
            <button type="button" onClick={cancelEdit}>
              Cancel Editing
            </button>
          )}
        </form>
      </section>

      <section className="admin-section">
        <h2>Manage Packages</h2>

        <button type="button" onClick={loadDashboard}>
          Refresh Dashboard
        </button>

        {packages.map((item) => (
          <article className="admin-item" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.destination} · {item.location}</p>
              <p>₹{item.price} · {item.duration} days</p>
            </div>

            <div className="admin-actions">
              <button type="button" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-section">
        <h2>All Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking, index) => (
            <article
              className="admin-item"
              key={booking.id ?? index}
            >
              <div>
                <h3>Booking #{booking.id ?? index + 1}</h3>
                <p>Traveler: {booking.username || booking.email || "Not provided"}</p>
                <p>Package: {booking.packageTitle || booking.title || booking.packageId || "Not provided"}</p>
                <p>Amount: ₹{booking.finalAmount ?? booking.totalPrice ?? booking.price ?? "N/A"}</p>
                <p>Status: {booking.status || "Unknown"}</p>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
