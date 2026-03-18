// app/_layout.tsx
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Query 클라이언트 생성
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // React Query 클라이언트를 앱 전체에 제공
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}
