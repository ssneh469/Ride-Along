const API_BASE = "http://localhost:5000/api";

// ---------- helpers ----------

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function setToken(token: string) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function setUser(user: Record<string, unknown>) {
  localStorage.setItem("user", JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem("user");
}

async function request(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ---------- Auth ----------

export async function register(
  name: string,
  email: string,
  password: string,
  phone?: string
) {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });

  if (res.ok) {
    setToken(res.data.token as string);
    setUser(res.data.user as Record<string, unknown>);
  }

  return res;
}

export async function login(email: string, password: string) {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    setToken(res.data.token as string);
    setUser(res.data.user as Record<string, unknown>);
  }

  return res;
}

export function logout() {
  clearToken();
  clearUser();
}

export async function getMe() {
  return request("/auth/me");
}

export { getToken, getUser };

// ---------- Rides ----------

export async function getRides(params?: { destination?: string; source?: string }) {
  const query = new URLSearchParams();
  if (params?.destination) query.set("destination", params.destination);
  if (params?.source) query.set("source", params.source);
  const qs = query.toString();
  return request(`/rides${qs ? `?${qs}` : ""}`);
}

export async function getRide(id: string) {
  return request(`/rides/${id}`);
}

export async function createRide(data: {
  source: string;
  destination: string;
  departureTime: string;
  seats: number;
  pricePerSeat: number;
}) {
  return request("/rides", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyRides() {
  return request("/rides/my/offered");
}

export async function cancelRide(id: string) {
  return request(`/rides/${id}/cancel`, { method: "PATCH" });
}

// ---------- Bookings ----------

export async function createBooking(rideId: string, seats: number) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify({ rideId, seats }),
  });
}

export async function getMyBookings() {
  return request("/bookings");
}

export async function getBooking(id: string) {
  return request(`/bookings/${id}`);
}

export async function cancelBooking(id: string) {
  return request(`/bookings/${id}/cancel`, { method: "PATCH" });
}
