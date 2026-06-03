import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import { baseUrl } from "../../utils/constants";
import styles from "./detail.module.css";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  const [offer, setOffer] = useState(null);
  const [myOffers, setMyOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMyOfferId, setSelectedMyOfferId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadOffer = async () => {
      try {
        const response = await api.get(`/api/v1/offers/${id}`);
        setOffer(response.data);
      } catch (err) {
        console.error("Failed to load offer: ", err);
      }
    };
    loadOffer();
  }, [id]);

  useEffect(() => {
    if (isModalOpen && isAuthorized) {
      const fetchMyOffers = async () => {
        try {
          const response = await api.get("/api/v1/offers/me");
          setMyOffers(response.data);
        } catch (err) {
          console.error("Failed to load your offers: ", err);
        }
      };
      fetchMyOffers();
    }
  }, [isModalOpen, isAuthorized]);

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    if (!selectedMyOfferId) return;

    setIsSubmitting(true);
    try {
      await api.post("/api/v1/deals/", {
        initiator_offer: selectedMyOfferId,
        responder_offer: offer.id,
      });
      setIsModalOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Failed to create deal: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOwnerPhoto = (path) => `${baseUrl}/${path}`;
  const getMainImage = (data) => data?.media?.[0]?.file || null;

  if (!offer) {
    return (
      <div className={styles.loadingContainer}>Loading offer details...</div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      <Link to="/" className={styles.backLink}>
        <img
          src="/src/assets/icons/arrow-left.svg"
          className={styles.backLinkIcon}
          alt="Back"
        />
        Home · Offer details
      </Link>

      <div className={styles.mainContent}>
        <div className={styles.imageSide}>
          <img
            src={getMainImage(offer)}
            className={styles.productImage}
            alt={offer.title}
          />
        </div>

        <div className={styles.infoSide}>
          <div className={styles.metaWrapper}>
            <div className={styles.authorProfile}>
              <img
                src={getOwnerPhoto(offer.owner_photo)}
                className={styles.authorAvatar}
                alt={offer.owner}
              />
              <h3 className={styles.authorName}>{offer.owner}</h3>
            </div>

            <h2 className={styles.productTitle}>{offer.title}</h2>

            <div className={styles.descriptionBox}>
              <h4 className={styles.descriptionHeader}>Description</h4>
              <p className={styles.descriptionText}>{offer.description}</p>
            </div>

            <div className={styles.desiredOfferBox}>
              <h4 className={styles.desiredOfferHeader}>Desired offer</h4>
              <p className={styles.desiredOfferText}>
                {offer.desired_offer || "Contractual"}
              </p>
            </div>

            <div className={styles.contact}>
              <h4 className={styles.contactHeader}>Contact</h4>
              <div className={styles.contactMeta}>
                <img
                  src="/src/assets/icons/phone.svg"
                  className={styles.contactIcon}
                />
                <p>{offer.phone}</p>
              </div>
            </div>

            <div className={styles.timeBadge}>
              <img
                src="/src/assets/icons/clock.svg"
                className={styles.timeIcon}
                alt="Clock"
              />
              <span>Post by {offer.created_at}</span>
            </div>

            <div className={styles.actionWrapper}>
              {isAuthorized ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={styles.btnPrimary}
                >
                  Make a Deal
                </button>
              ) : (
                <Link to="/login" className={styles.btnSecondary}>
                  <img
                    src="/src/assets/icons/ref.svg"
                    className={styles.btnIcon}
                    alt=""
                  />
                  <span>Sign In to offer</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.productTitle}>Select an Offer to Trade</h3>
            <p className={styles.descriptionText}>
              Trading for: <strong>{offer.title}</strong>
            </p>

            <form onSubmit={handleCreateDeal} className={styles.modalForm}>
              <select
                className={styles.offerSelect}
                value={selectedMyOfferId}
                onChange={(e) => setSelectedMyOfferId(e.target.value)}
                required
              >
                <option value="">-- Choose one of your offers --</option>
                {myOffers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={isSubmitting || !selectedMyOfferId}
                >
                  {isSubmitting ? "Sending..." : "Confirm Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
