import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import styles from "./list.module.css";

const OfferList = ({ offer, onDeleteSuccess }) => {
  const [offers, setOffers] = useState([]);
  const imageUrl = offer.media?.[0]?.file || null;

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await api.get("/api/v1/offers/my/");
        setOffers(response.data);
      } catch (err) {
        console.err("Failed to load users offers: ", err);
      }
    };
  }, []);

  const handleDelete = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const toastId = toast.loading("Deleting offer...");
      try {
        await api.delete(`/api/v1/offers/${offer.id}/`);
        toast.success("Offer deleted successfully!", { id: toastId });
        onDeleteSuccess(offer.id);
      } catch (err) {
        console.error("Failed to delete offer: ", err);
        toast.error("Failed to delete the offer. Please try again.", {
          id: toastId,
        });
      }
    },
    [offer.id, onDeleteSuccess],
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardContainer}>
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt={offer.title} className={styles.image} />
        </div>

        <div className={styles.contentArea}>
          <div className={styles.headerRow}>
            <h3 className={styles.title}>{offer.title}</h3>
            <div className={styles.badgeRow}>
              <span className={styles.statusTag}>{offer.status}</span>
            </div>
          </div>

          <p className={styles.description}>{offer.description}</p>

          <div className={styles.actions}>
            <span className={styles.timeText}>
              <img src="/src/assets/icons/clock.svg" />
              Last update {offer.time_since_update}
            </span>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              aria-label="Delete offer"
            >
              <img
                src="/src/assets/icons/trash.svg"
                className={styles.deleteIcon}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferList;
