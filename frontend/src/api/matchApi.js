import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

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
