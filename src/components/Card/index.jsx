import { Link } from "react-router-dom";
import { baseUrl } from "../../utils/constants";
import styles from "./card.module.css";

const OfferCard = ({ offer }) => {
  const ownerPhoto = (ownerPhotoUrl) => `${baseUrl}/${ownerPhotoUrl}`;

  const mainImage = (offer) =>
    offer.media && offer.media.length > 0 ? offer.media[0].file : null;

  return (
    <Link to={`/offers/${offer.id}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.authorProfile}>
          <img
            src={ownerPhoto(offer.owner_photo)}
            className={styles.authorAvatar}
          />
          <div className={styles.authorMeta}>
            <h4 className={styles.authorName}>{offer.owner}</h4>
            <span className={styles.postDate}>{offer.created_at}</span>
          </div>
        </div>
        <span className={styles.categoryBadge}>{offer.category.category}</span>
      </div>

      <div className={styles.imageWrapper}>
        <img src={mainImage(offer)} className={styles.productImage} />
      </div>

      <div className={styles.textWrapper}>
        <h3 className={styles.productTitle}>{offer.title}</h3>
        <p className={styles.productDescription}>{offer.description}</p>
        <p className={styles.desiredOffer}>{offer.desired_offer || "Contractual"}</p>
      </div>
    </Link>
  );
};

export default OfferCard;
