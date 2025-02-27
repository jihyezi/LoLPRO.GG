import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3000/api";

console.log("🔍 Backend URL:", process.env.REACT_APP_BACKEND_URL);
console.log("🔍 BASE_URL:", BASE_URL);

export const fetchMatches = async (year) => {
  try {
    const response = await axios.get(`${BASE_URL}/matches`, {
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching matches:", error.message);
    return [];
  }
};
