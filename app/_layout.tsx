import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaBlur } from "../src/components/ui/SafeAreaBlur";
import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <SafeAreaBlur />
          <Stack>
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(protected)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="recipe/[id]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
