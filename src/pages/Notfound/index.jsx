import { Link } from "react-router-dom";
import styles from "./notfound.module.css";

const Notfound = () => (
  <div className={styles.container}>
    <img
      src="/src/assets/images/notfound.png"
      className={styles.notfoundImage}
    />
    <h2 className={styles.title}>No records found.</h2>
    <button className={styles.btn}>
      <Link to="/">GO TO HOME</Link>
    </button>
  </div>
);

export default Notfound;
