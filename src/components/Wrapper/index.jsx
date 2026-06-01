import { Outlet } from "react-router-dom";
import { Navbar, Header } from "../../layout"
import styles from "./wrapper.module.css"

const Wrapper = () => (
  <div>
    <Navbar />
    <Header />
    <main className={styles.container}>
      <Outlet />
    </main>
  </div>
)

export default Wrapper
