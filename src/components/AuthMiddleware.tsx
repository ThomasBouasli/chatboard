import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { auth } from "@/lib/firebase";

type AuthMiddlewareProps = {
  redirectTo: string;
  redirectWhen: "authenticated" | "unauthenticated";
};

const AuthMiddleware = ({ redirectTo, redirectWhen }: AuthMiddlewareProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth.currentUser);

  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    setIsAuthenticated(!!user);
  });

  useEffect(() => {
    if (redirectWhen === "authenticated" && isAuthenticated) {
      navigate(redirectTo);
    } else if (redirectWhen === "unauthenticated" && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectWhen, redirectTo]);

  return <Outlet />;
};
export default AuthMiddleware;
