import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Index() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
