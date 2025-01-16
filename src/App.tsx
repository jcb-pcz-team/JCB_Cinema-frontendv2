/**
 * @fileoverview Główny komponent aplikacji odpowiedzialny za layout i routing strony głównej.
 */

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
    return (
        <MainLayout>
            <Home />
            <Showtime />
            <FeaturedMovie />
            <MovieSlider />
        </MainLayout>
    );
};