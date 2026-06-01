import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Components from "../components";
import * as Pages from "../pages";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Components.Wrapper />}>
        <Route path="/" element={<Pages.Home />} />
      </Route>
      <Route path="*" element={<Pages.Notfound />} />
      <Route path="/register" element={<Pages.Signup />} />
      <Route path="/login" element={<Pages.Login />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
