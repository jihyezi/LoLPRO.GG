import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchRankings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/rankings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rankings:", error.message);
    return [];
  }
};
