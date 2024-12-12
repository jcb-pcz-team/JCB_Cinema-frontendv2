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
import {MovieManagement} from "./components/Admin/Movies/MovieManagement.tsx";
import {ProjectionManagement} from "./components/Admin/Projections/ProjectionManagement.tsx";
import {HallManagement} from "./components/Admin/Halls/HallManagement.tsx";
import {ScheduleManagement} from "./components/Admin/Schedules/ScheduleManagement.tsx";
import {UserManagement} from "./components/Admin/Users/UserManagement.tsx";
import {TicketManagement} from "./components/Admin/Tickets/TicketManagement.tsx";
import {AdminLayout} from "./components/Admin/AdminLayout.tsx";
import {AdminGuard} from "./components/Admin/AdminGuard/AdminGuard.tsx";

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
            },],
    },
    {
        path: "/admin",
        element: (
            <AdminGuard>
                <AdminLayout />
            </AdminGuard>
        ),
        children: [
            {
                path: "movies",
                element: <MovieManagement />
            },
            {
                path: "projections",
                element: <ProjectionManagement />
            },
            {
                path: "halls",
                element: <HallManagement />
            },
            {
                path: "schedules",
                element: <ScheduleManagement />
            },
            {
                path: "users",
                element: <UserManagement />
            },
            {
                path: "tickets",
                element: <TicketManagement />
            }
        ]
    }
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
