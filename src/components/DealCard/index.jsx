import { useState } from "react";
import { baseUrl } from "../../utils/constants";
import api from "../../services/api";
import styles from "./dealCard.module.css";

const DealCard = ({ deal, currentUser, onStatusUpdate }) => {
  const { initiator_offer, responder_offer, status, responder } = deal;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageDeal = currentUser === responder && status === "PROPOSED";

  const getOwnerPhoto = (path) => `${baseUrl}/${path}`;

  const handleAction = async (actionType) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(
        `/api/v1/deals/${deal.id}/${actionType}/`,
      );
      if (onStatusUpdate) {
        onStatusUpdate(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOfferCard = (offer, isResponderSide) => {
    return (
      <div className={styles.offerCard}>
        <div className={styles.cardHeader}>
          <img
            src={getOwnerPhoto(offer.owner_photo)}
            className={styles.avatar}
            alt={offer.owner}
          />
          <div className={styles.userInfo}>
            <h4 className={styles.username}>{offer.owner}</h4>
            <span className={styles.contactPhone}>{offer.phone}</span>
          </div>
          <span className={styles.sideBadge}>
            {isResponderSide ? "Receiving" : "Offering"}
          </span>
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.offerTitle}>{offer.title}</h3>
          <p className={styles.offerDescription}>{offer.description}</p>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.timeBadge}>{offer.created_at}</span>
          {isResponderSide && canManageDeal && (
            <div className={styles.actionGroup}>
              <button
                onClick={() => handleAction("reject")}
                className={styles.btnDecline}
                disabled={isSubmitting}
              >
                Decline
              </button>
              <button
                onClick={() => handleAction("accept")}
                className={styles.btnAccept}
                disabled={isSubmitting}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dealRowContainer}>
      <div className={styles.dealMetaInfo}>
        <span
          className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}
        >
          {status}
        </span>
        <span className={styles.dealTimestamp}>Sent: {deal.created_at}</span>
      </div>

      <div className={styles.flexWrapper}>
        {renderOfferCard(initiator_offer, false)}

        <div className={styles.arrowDivider}>
          <img src="/src/assets/icons/arrow-right-left.svg" alt="" />
        </div>

        {renderOfferCard(responder_offer, true)}
      </div>
    </div>
  );
};

export default DealCard;
