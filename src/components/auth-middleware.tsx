import Dot from "./dot";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";

type AuthMiddlewareProps = {
  redirectTo: string;
  redirectWhen: "authenticated" | "unauthenticated";
};

const AuthMiddleware = ({ redirectTo, redirectWhen }: AuthMiddlewareProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBuffer, setLoadingBuffer] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth.currentUser);

  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    setLoading(false);
    setLoadingBuffer(false);
    setIsAuthenticated(!!user);
  });

  useEffect(() => {
    if (redirectWhen === "authenticated" && isAuthenticated) {
      navigate(redirectTo);
    } else if (redirectWhen === "unauthenticated" && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectWhen, redirectTo]);

  useEffect(() => {
    if (!loading) return;

    const timeout = setTimeout(() => {
      setLoadingBuffer(true);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [loading]);

  if (loadingBuffer)
    return (
      <div className="absolute h-[100dvh] w-full">
        <Dot className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform animate-pulse" />
      </div>
    );

  if (loading) return null;

  return <Outlet />;
};
export default AuthMiddleware;
