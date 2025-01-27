import { axios } from "@/lib/axios";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useVerifyToken = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get("/verify-token");
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    const timer = setTimeout(() => verify(), 500);

    return () => clearTimeout(timer);
  }, []);
};
