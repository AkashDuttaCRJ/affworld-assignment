import { axios } from "@/lib/axios";
import { BoardData } from "@/types/task";
import { useQuery } from "@tanstack/react-query";

const fetchAllTasks = async () => {
  try {
    const response = await axios.get("/tasks");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tasks");
  }
};

export const useGetAllTasks = () => {
  return useQuery<BoardData>({
    queryKey: ["tasks"],
    queryFn: fetchAllTasks,
  });
};
