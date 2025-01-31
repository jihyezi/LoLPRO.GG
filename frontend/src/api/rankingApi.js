import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchRankings = async (year, season) => {
  try {
    const response = await axios.get(`${BASE_URL}/rankings`, {
      params: { year, season },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching rankings:", error.message);
    return [];
  }
};
