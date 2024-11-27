import {MainLayout} from "./layouts/MainLayout/MainLayout.tsx";
import {Home} from "./pages/Home/Home.tsx";
import {PageLogin} from "./pages/LoginPage/PageLogin.tsx";
import {FormLogin} from "./components/FormLogin/FormLogin.tsx";
import {FormRegister} from "./components/RegisterForm/RegisterForm.tsx";
import {PageRegister} from "./pages/PageRegister/PageRegister.tsx";

export const App = () => {
  return (
    <MainLayout>
      <PageRegister>
          <FormRegister/>
      </PageRegister>
    </MainLayout>
  )
};