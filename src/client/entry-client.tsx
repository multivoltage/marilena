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
    element: (
      <div className="page page__email-list">
        <EmailList />
      </div>
    ),
  },
  {
    path: "/:emailName",
    element: (
      <div className="page page__email-variants">
        <EmailVariants />
      </div>
    ),
  },
  {
    path: "/:emailName/:locale",
    element: (
      <div className="page page__email">
        <Email />
      </div>
    ),
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

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
