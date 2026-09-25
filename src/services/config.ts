export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// When TRUE or when running frontend demo, services resolve against mockStorage
export const USE_MOCK_DATA = true;

// Helper to simulate network latency for realistic enterprise UI demo
export const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));
