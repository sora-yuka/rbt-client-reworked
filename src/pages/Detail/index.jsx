import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import { baseUrl } from "../../utils/constants";
import styles from "./detail.module.css";

const Detail = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const { isAuthorized } = useAuth();

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
              {offer.desired_offer ? (
                <p className={styles.desiredOfferText}>{offer.desired_offer}</p>
              ) : (
                <p className={styles.desiredOfferText}>Contractual</p>
              )}
            </div>

            <div className={styles.contact}>
              <h4 className={styles.contactHeader}>Contact</h4>
              <div className={styles.contactMeta}>
                <img src="/src/assets/icons/phone.svg" className={styles.contactIcon} />
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
                <button className={styles.btnPrimary}>Offer</button>
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
    </div>
  );
};

export default Detail;
