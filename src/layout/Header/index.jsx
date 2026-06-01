import styles from "./header.module.css";

const Header = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Exchange marketplace</h1>
      <p className={styles.headerText}>
        Find useful things nearby and trade them for something better. Browse
        live offers, compare desired swaps, and start a deal when you are ready.
      </p>
    </div>
  </header>
);

export default Header;
