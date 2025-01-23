/**
 * @fileoverview Główny komponent aplikacji odpowiedzialny za layout i routing strony głównej.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from "./layouts/MainLayout/MainLayout.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { Showtime } from "./components/Showtimes/Showtime.tsx";
import { FeaturedMovie } from "./components/FeaturedMovie/FeaturedMovie.tsx";
import { MovieSlider } from "./components/MovieSlider/MovieSlider.tsx";

/**
 * Główny komponent aplikacji
 * @component
 * @returns {JSX.Element} Komponent App z zagnieżdżonymi komponentami w MainLayout
 *
 * @example
 * ```tsx
 * <App />
 * ```
 */
export const App = () => {
    const location = useLocation();

    useEffect(() => {
        // Sprawdź, czy jest parametr scrollTo w URL
        const params = new URLSearchParams(location.search);
        const scrollTo = params.get('scrollTo');

        if (scrollTo) {
            // Daj chwilę na załadowanie komponentów
            setTimeout(() => {
                const element = document.getElementById(scrollTo);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location]);

    return (
        <MainLayout>
            <Home />
            <Showtime />
            <FeaturedMovie />
            <MovieSlider />
        </MainLayout>
    );
};