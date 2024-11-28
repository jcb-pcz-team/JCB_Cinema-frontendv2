import {MainLayout} from "./layouts/MainLayout/MainLayout.tsx";
import {Home} from "./pages/Home/Home.tsx";
import {Showtime} from "./components/Showtimes/Showtime.tsx";
import {FeaturedMovie} from "./components/FeaturedMovie/FeaturedMovie.tsx";
import {MovieSlider} from "./components/MovieSlider/MovieSlider.tsx";

export const App = () => {
  return (
    <MainLayout>
      <Home/>
        <Showtime/>
        <FeaturedMovie/>
        <MovieSlider/>
    </MainLayout>
  )
};