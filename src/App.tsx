import {MainLayout} from "./layouts/MainLayout/MainLayout.tsx";
import {Home} from "./pages/Home/Home.tsx";

export const App = () => {
  return (
    <MainLayout>
      <Home/>
    </MainLayout>
  )
};