import { axios } from "@/lib/axios"; // Import the axios instance you created
import { PostResponse } from "@/types/post";
import { useQuery } from "@tanstack/react-query";

// Function to fetch all posts
const fetchAllPosts = async () => {
  try {
    const response = await axios.get("/post");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch posts");
  }
};

// Custom hook to fetch all posts
export const useGetAllPosts = () => {
  return useQuery<PostResponse>({
    queryKey: ["posts"],
    queryFn: fetchAllPosts,
  });
};
