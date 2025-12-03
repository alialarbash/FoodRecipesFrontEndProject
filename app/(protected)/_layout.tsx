import { Stack } from "expo-router";
import { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProtectedLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="recipes/[category]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
