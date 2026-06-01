import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Button } from "../../components";
import { baseUrl } from "../../utils/constants";
import styles from "./navbar.module.css";

const Navbar = () => {
  const { user, isAuthorized, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const avatarSrc = user?.profilePhoto
    ? `${baseUrl}/${user.profilePhoto}`
    : "/src/assets/icons/circle-user.svg";

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoLink}>
          <NavLink to="/">
            <img
              src="/src/assets/images/b-logo.png"
              className={styles.logoImg}
            />
          </NavLink>
        </div>

        <div className={styles.navActions}>
          {isAuthorized ? (
            <div className={styles.profileDropdownWrapper} ref={dropdownRef}>
              <button
                className={styles.avatarButton}
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
              >
                <img src={avatarSrc} className={styles.avatarImg} />
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdownMenu} role="menu">
                  <NavLink
                    to="/offers/my"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <img src="/src/assets/icons/offers.svg" />
                    My offers
                  </NavLink>
                  <NavLink
                    to="/offers/new"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <img src="/src/assets/icons/new.svg" />
                    Create offer
                  </NavLink>
                  <NavLink
                    to="/deals"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <img src="/src/assets/icons/handshake.svg" />
                    Deals
                  </NavLink>
                  <hr className={styles.dropdownDivider} />
                  <button
                    onClick={handleLogout}
                    className={`${styles.dropdownItem} ${styles.logoutButton}`}
                  >
                    <img src="/src/assets/icons/log-out.svg" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtonGroup}>
              <NavLink to="/login">
                <Button className="signin">Sign In</Button>
              </NavLink>
              <NavLink to="/register">
                <Button className="signup">Create Account</Button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
