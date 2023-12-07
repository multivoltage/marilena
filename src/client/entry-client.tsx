import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { EmailList } from "./pages/EmailList";
import { EmailVariants } from "./pages/EmailVariants";
import { Email } from "./pages/Email";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";

const container = document.getElementById("app");

const router = createBrowserRouter([
  {
    path: "/",
    element: <EmailList />,
  },
  {
    path: "/:emailName",
    element: <EmailVariants />,
  },
  {
    path: "/:emailName/:locale",
    element: <Email />,
  },
]);

const queryClient = new QueryClient();

const FullApp = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container!);
  root.render(<FullApp />);
} else {
  hydrateRoot(container!, <FullApp />);
}
