const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options?.headers || {}),
    },
  });
  return res;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiFetch("/auth/me"),

  // Rides
  getRides: (params?: { source?: string; destination?: string }) => {
    const qs = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return apiFetch(`/rides${qs}`);
  },

  getMyOfferedRides: () => apiFetch("/rides/my/offered"),

  createRide: (data: {
    source: string;
    destination: string;
    departureTime: string;
    seats: number;
    pricePerSeat: number;
  }) =>
    apiFetch("/rides", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cancelRide: (id: string) =>
    apiFetch(`/rides/${id}/cancel`, { method: "PATCH" }),

  // Bookings
  getMyBookings: () => apiFetch("/bookings"),

  createBooking: (rideId: string, seats: number) =>
    apiFetch("/bookings", {
      method: "POST",
      body: JSON.stringify({ rideId, seats }),
    }),

  cancelBooking: (id: string) =>
    apiFetch(`/bookings/${id}/cancel`, { method: "PATCH" }),
};
