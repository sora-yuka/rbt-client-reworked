import { AuthProvider } from "./AuthProvider";
import { Toaster } from "react-hot-toast";
import Router from "./Router";

const App = () => (
  <AuthProvider>
    <Toaster position="bottom-center"/>
    <Router />
  </AuthProvider>
);

export default App;
