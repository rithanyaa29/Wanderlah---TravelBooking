import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./context/AuthContext";
import { useBooking } from "./context/BookingContext";
import usePackages from "./hooks/usePackages";
import PackageCard from "./components/PackageCard";
import PackageDetail from "./components/PackageDetail";
import BookingTravelers from "./components/BookingTravelers";
import reducer, {
  addToCart, cancelBooking, selectFinalAmount, setTravelDates,
} from "./store/bookingSlice";1

jest.mock("./context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("./context/BookingContext", () => ({ useBooking: jest.fn() }));
jest.mock("./api/api", () => ({
  fetchPackages: jest.fn(),
  fetchPackageById: jest.fn(),
}));
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useOutletContext: () => ({
    travelers: 2,
    setTravelers: mockSetTravelers,
    travelerDetails: { name: "", email: "", phone: "" },
    setTravelerDetails: mockSetTravelerDetails,
  }),
}));

const mockNavigate = jest.fn();
const mockSetTravelers = jest.fn();
const mockSetTravelerDetails = jest.fn();
const pkg = {
  id: 1, title: "Goa Beach Holiday", destination: "Goa", location: "Baga Beach",
  category: "Beach", duration: 4, rating: 4.5, price: 12000,
  description: "A relaxing beach trip", itinerary: ["Visit the beach"],
};

describe("Travel booking experiment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isLoggedIn: true });
    useBooking.mockReturnValue({ addToCart: jest.fn(), removeFromCart: jest.fn(), cartItems: [] });
    useDispatch.mockReturnValue(jest.fn());
  });

  test("shows a package card and its detail page", async () => {
    useSelector.mockImplementation((select) => select({ booking: { packageCache: { 1: pkg } } }));
    render(<MemoryRouter initialEntries={["/package/1"]}>
      <Routes><Route path="/package/:id" element={<PackageDetail />} /></Routes>
    </MemoryRouter>);
    expect(await screen.findByRole("heading", { name: pkg.title })).toBeInTheDocument();
    expect(screen.getByText(pkg.description)).toBeInTheDocument();
    expect(screen.getAllByText(/₹12000/)).toHaveLength(2);

    render(<MemoryRouter><PackageCard packageData={pkg} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute("href", "/package/1");
    expect(screen.getAllByRole("button", { name: "Select Package" })).toHaveLength(2);
  });

  test("filters packages by destination and budget", async () => {
    const { fetchPackages } = await import("./api/api");
    fetchPackages.mockResolvedValue([pkg, { ...pkg, id: 2, title: "Kerala Tour", destination: "Kerala", price: 18000 }]);
    const { result } = renderHook(() => usePackages());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.setSearch("Goa");
      result.current.setBudget("15000");
    });
    await waitFor(() => expect(result.current.filteredPackages.map((item) => item.id)).toEqual([1]));
  });

  test("accepts traveler details and a travel date", () => {
    render(<MemoryRouter><BookingTravelers /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { name: "name", value: "Arun" },
    });
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "3" } });
    expect(mockSetTravelerDetails).toHaveBeenCalledWith({ name: "Arun", email: "", phone: "" });
    expect(mockSetTravelers).toHaveBeenCalledWith(3);
    const state = reducer(undefined, setTravelDates({ startDate: "2026-11-10", endDate: "2026-11-13" }));
    expect(state.travelDates.startDate).toBe("2026-11-10");
  });

  test("adds a booking, calculates its total, and marks it cancelled", () => {
    let state = reducer(undefined, addToCart({ packageData: pkg, travelers: 2 }));
    const root = { booking: state };
    expect(state.cartItems[0].total).toBe(24000);
    expect(selectFinalAmount(root)).toBe(25200);
    state = reducer({ ...state, bookingHistory: [{ id: 9, status: "Confirmed" }] }, cancelBooking(9));
    expect(state.bookingHistory[0].status).toBe("Cancelled");
  });
});
