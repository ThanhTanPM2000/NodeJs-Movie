import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/genres";

export async function getGenres() {
  try {
    const response = await http.get(apiEndpoint, {});
    return response;
  } catch (error) {}
}
