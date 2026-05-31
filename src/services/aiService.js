import apiClient from "./apiClient";
import { USE_MOCK_DATA } from "../utils/constants";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 450));

export const aiService = {
  async generateTaskDetails(title) {
    if (!USE_MOCK_DATA) {
      const response = await apiClient.post("/ai/generate", {
        title: title.trim()
      });

      return response?.data?.data;
    }

    if (title.trim().toLowerCase() === "prepare client presentation") {
      return delay({
        description:
          "Create and organize presentation slides for client review.",
        priority: "HIGH",
        estimatedTime: "4 Hours"
      });
    }

    return delay({
      description: `Plan, organize, and complete "${title.trim()}" with clear milestones and review notes.`,
      priority: "MEDIUM",
      estimatedTime: "2 Hours"
    });
  }
};