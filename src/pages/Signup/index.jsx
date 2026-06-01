import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import defaultAvatar from "../../assets/icons/circle-user.svg"
import styles from "./signup.module.css";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("phone_number", formData.phoneNumber);
      data.append("password", formData.password);

      if (profilePhoto) {
        data.append("profile_photo", profilePhoto);
      }

      await api.post("/api/v1/users/register/", data);
      const result = await login({
        phone_number: formData.phoneNumber,
        password: formData.password,
      });

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Sign Up failed: ", err);
      setError(err.response?.data?.detail);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be 2 MB or smaller");
      event.target.value = "";
      return;
    }
    setError("");
    setProfilePhoto(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.back}>
        <img src="/src/assets/icons/back.svg" />
        Home page
      </Link>
      <div className={styles.body}>
        <aside className={styles.visual}>
          <div className={styles.avatar}>
            <img
              className={styles.avatarImage}
              src={imagePreview || defaultAvatar}
              alt="Profile Preview"
            />
          </div>
          <h2 className={styles.visualTitle}>Upload Image</h2>
          <p className={styles.visualText}>Max File Size: 2mb</p>
          <button
            className={styles.uploadBtn}
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Add Image
          </button>
          <input
            ref={fileInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/"
            onChange={handleImageChange}
          />
        </aside>
        <div className={styles.formContainer}>
          <h2 className={styles.header}>Sign Up to platform</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className={styles.switch}>
              Already have an account?{" "}
              <Link className={styles.switchLink} to="/login">
                Sign In
              </Link>
            </p>
            <button className={styles.btn} type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
