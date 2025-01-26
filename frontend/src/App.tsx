import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterConfig } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterConfig />
      </QueryClientProvider>
    </>
  );
}

export default App;
