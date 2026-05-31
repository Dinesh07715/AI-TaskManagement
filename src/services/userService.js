import apiClient from "./apiClient";

export const userService = {
  async getUsers() {
    const response = await apiClient.get("/users");
    return response.data.data;
  }
};