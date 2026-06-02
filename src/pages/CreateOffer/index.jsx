import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import styles from "./createOffer.module.css";

const CreateOffer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    desired_offer: "",
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );
    setImages((prev) => [...prev, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileClick = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      const toastId = toast.loading("Sending data...");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);

      const desiredOfferValue =
        formData.desired_offer.trim() === "" ? "" : formData.desired_offer;
      data.append("desired_offer", desiredOfferValue);

      images.forEach((imageFile) => {
        data.append("uploaded_images", imageFile);
      });

      try {
        await api.post("/api/v1/offers/", data);
        toast.success("Offer created successfully!", { id: toastId });
        setFormData({
          title: "",
          description: "",
          category: "",
          desired_offer: "",
        });
        setImages([]);

        navigate("/offers/my");
      } catch (err) {
        toast.error("Failed to create offer.", { id: toastId });
        console.error("Upload error: ", err.response?.data || err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, images, isSubmitting],
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Create offer</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.flexContainer}>
          <label className={styles.label}>
            Title
            <input
              type="text"
              name="title"
              placeholder="Write item name"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label className={styles.label}>
            Desired offer
            <input
              type="text"
              name="desired_offer"
              placeholder="What item you want?"
              value={formData.desired_offer}
              onChange={handleChange}
            />
          </label>

          <label className={styles.label}>
            Category
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select category
              </option>
              <option value={1}>Electronics</option>
              <option value={2}>Clothings</option>
              <option value={3}>Books</option>
            </select>
          </label>
        </div>

        <div className={styles.uploadSection}>
          <span className={styles.sectionLabel}>Upload File</span>

          <div
            className={`${styles.dropZone} ${isDragActive ? styles.dragActive : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleFileClick}
              disabled={isSubmitting}
            />

            <div>
              <img
                src="/src/assets/icons/upload.svg"
                className={styles.uploadIcon}
                alt="upload"
              />
            </div>

            <p className={styles.uploadConstraints}>Allowed PNG, JPEG</p>

            <label htmlFor="file-upload" className={styles.browseButton}>
              Browse File
            </label>
          </div>

          {images.length > 0 && (
            <div className={styles.previewGrid}>
              {images.map((file, idx) => (
                <div key={idx} className={styles.previewContainer}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeBadge}
                    onClick={() => removeImage(idx)}
                  >
                    <img src="/src/assets/icons/x.svg" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className={styles.label}>
          Description
          <textarea
            name="description"
            placeholder="Describe your offer here!"
            rows={6}
            required
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <div className={styles.actionsContainer}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Creating..." : "Create Offer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOffer;
