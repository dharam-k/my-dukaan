// Set your base ERPNext API URL
const BASE_URL = "http://34.220.18.12/api";

// --- Helper function for API requests ---
async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `token ${token}`;

  const options = {
    method,
    headers,
    credentials: "include", // If you need cookies (session)
  };

  if (data) options.body = JSON.stringify(data);

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "ERPNext API error");
  }
  return response.json();
}

// --- Authentication (Login) ---
export async function erpnextLogin({ usr, pwd }) {
  return apiRequest("/method/login", "POST", { usr, pwd });
}

// --- Example: Get current user info (after login) ---
export async function getCurrentUser(token = null) {
  return apiRequest("/method/frappe.auth.get_logged_user", "GET", null, token);
}

// --- Example: Get Buyers (customize as per your doc type) ---
export async function getBuyers(token = null) {
  // Adjust the DocType: replace "Buyer" with your actual doctype name
  return apiRequest("/resource/Buyer", "GET", null, token);
}

// --- Example: Create a new Buyer ---
export async function createBuyer(data, token) {
  return apiRequest("/resource/Buyer", "POST", data, token);
}

// --- Add more methods as needed for Orders, Sellers, etc. ---
