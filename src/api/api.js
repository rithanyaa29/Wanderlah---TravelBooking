
import axios from "axios";

const API_URL = import.meta.env.DEV
  ? "http://localhost:3330"
  : "/api";
const TOKEN_KEY = "wanderlahToken";
const ADMIN_TOKEN_KEY = "wanderlahAdminToken";
// Public API
const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 10000
});
// =====================================
// TRAVELER API
// =====================================

const bookingApi = axios.create({
  baseURL: API_URL
});

bookingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================================
// ADMIN API
// =====================================

const adminApi = axios.create({
  baseURL: API_URL
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================================
// AUTHENTICATION
// =====================================

export const signupTraveler = async (userData) => {
  const response = await axios.post(
    `${API_URL}/auth/signup`,
    userData
  );

  console.log("[TRAVELER] Signup successful");
  return response.data;
};

export const loginTraveler = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    loginData
  );

  console.log("[TRAVELER] Login successful");
  return response.data;
};

export const adminLogin = async (credentials) => {
  const response = await axios.post(
    `${API_URL}/auth/admin-login`,
    credentials
  );

  console.log("[ADMIN] Login successful");
  return response.data;
};


 // =====================================
 // PUBLIC PACKAGE REQUESTS
 // =====================================

export const fetchPackages = async (config = {}) => {
  const response = await publicApi.get("/packages", config);
  return response.data;
};

export const fetchPackageById = async (id, config = {}) => {
  const response = await publicApi.get(
    `/packages/${id}`,
    config
  );
  return response.data;
};

export const fetchAvailability = async (packageId, config = {}) => {
  const response = await publicApi.get(
    `/availability/${packageId}`,
    config
  );
  return response.data;
};

// =====================================
// ADMIN PACKAGE CRUD
// =====================================

export const getAdminPackages = async () => {
  console.log("[ADMIN GET] /packages");

  const response = await adminApi.get("/packages");
  return response.data;
};

export const addPackage = async (packageData) => {
  const response = await adminApi.post("/packages", packageData);

  console.log("[ADMIN CREATE] Package added", response.data);
  return response.data;
};

export const updatePackage = async (id, packageData) => {
  const response = await adminApi.put(
    `/packages/${id}`,
    packageData
  );

  console.log("[ADMIN UPDATE] Package updated", response.data);
  return response.data;
};

export const deletePackage = async (id) => {
  const response = await adminApi.delete(`/packages/${id}`);

  console.log("[ADMIN DELETE] Package deleted", id);
  return response.data;
};

// =====================================
// TRAVELER BOOKING CRUD
// =====================================

export const fetchBookings = async () => {
  console.log("[GET] /bookings");

  const response = await bookingApi.get("/bookings");
  return response.data;
};

export const fetchBookingById = async (id) => {
  console.log("[GET] /bookings/" + id);

  const response = await bookingApi.get(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await bookingApi.post(
    "/bookings",
    bookingData
  );

  console.log("[BOOKING CREATE]", response.data);
  return response.data;
};

export const updateBooking = async (id, bookingData) => {
  const response = await bookingApi.put(
    `/bookings/${id}`,
    bookingData
  );

  console.log("[BOOKING UPDATE]", id, response.data);
  return response.data;
};

export const patchBooking = async (id, bookingData) => {
  const response = await bookingApi.patch(
    `/bookings/${id}`,
    bookingData
  );

  console.log("[BOOKING PATCH]", id, response.data);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await bookingApi.delete(`/bookings/${id}`);

  console.log("[BOOKING DELETE/CANCEL]", id);
  return response.data;
};

// =====================================
// ADMIN BOOKING DASHBOARD
// =====================================

export const getAdminBookings = async () => {
  console.log("[ADMIN GET] /admin/bookings");

  const response = await adminApi.get("/admin/bookings");
  return response.data;
};
