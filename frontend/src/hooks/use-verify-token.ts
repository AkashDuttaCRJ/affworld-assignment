import { axios } from "@/lib/axios";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useVerifyToken = (path?: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get("/verify-token");
        if (res.status === 200 && path === "login") navigate("/app");
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    verify();
  }, []);
};
