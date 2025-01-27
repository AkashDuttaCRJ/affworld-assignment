import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function GoogleAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/app");
    } else {
      navigate("/");
    }
  }, []);

  return <></>;
}
