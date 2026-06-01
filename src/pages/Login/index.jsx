import { useState, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from "react-hot-toast";
import styles from "./login.module.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ phone_number: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      const toastId = toast.loading("Logging you in...");
      try {
        const result = await login(formData);

        if (result.success) {
          toast.success("Welcome back!", { id: toastId });
          navigate(location.state?.from || "/");
        } else {
          toast.error(result.error || "Login failed", { id: toastId });
          setError(result.error);
        }
      } catch (err) {
        toast.error("A network error occurred.", { id: toastId });
        setError("A network error occurred.");
      }
    },
    [formData, navigate, location.state],
  );

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.back}>
        <img src="/src/assets/icons/back.svg" />
        Home page
      </Link>
      <div className={styles.formContainer}>
        <h2 className={styles.header}>Sign Up to platform</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="phoneNumber"
            placeholder="Phone number"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                phone_number: e.target.value,
              }))
            }
            required
          />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                password: e.target.value,
              }))
            }
            required
          />
          <p className={styles.switch}>
            No account?{" "}
            <Link className={styles.switchLink} to="/register">
              Sign Up
            </Link>
          </p>
          <button className={styles.btn} type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
