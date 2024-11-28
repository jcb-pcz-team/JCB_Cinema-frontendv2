import './main.scss';
import {createRoot} from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App.tsx';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Tickets} from "./components/Tickets/Tickets.tsx";
import {Profile} from "./components/Profile/Profile.tsx";
import {Dashboard} from "./components/Dashboard/Dashboard.tsx";
import {PageLogin} from "./pages/LoginPage/PageLogin.tsx";
import {PageRegister} from "./pages/PageRegister/PageRegister.tsx";
import {Showtime} from "./components/Showtimes/Showtime.tsx";
import {Movie} from "./pages/Movie/Movie.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "showtimes",
                element: <Showtime />,
            },

        ],
    },
    {
        path: "movies/:movieId",
        element: <Movie/>,
    },
    {
        path: "/register",
        element: <PageRegister />,
    },
    {
        path: "/login",
        element: <PageLogin />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "tickets",
                element: <Tickets />,
            },
        ],
    },
]);


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000,
            retry: 1,
        },
        mutations: {
            retry: 1,
        },
    },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
  </StrictMode>,
)
