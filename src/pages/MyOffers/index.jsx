import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { OfferList } from "../../components";
import { baseUrl } from "../../utils/constants";
import styles from "./myoffers.module.css";

const MyOffers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const loadOffers = async () => {
      const response = await api.get("/api/v1/offers/me/");
      setOffers(response.data);
    };

    loadOffers();
  }, []);

  const ownerPhoto = (ownerPhotoUrl) => `${baseUrl}/${ownerPhotoUrl}`;

  const mainImage = (offer) =>
    offer.media && offer.media.length > 0 ? offer.media[0].file : null;

  const handleDeleteStateUpdate = (id) => {
    setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>My Offers</h3>
      <div className={styles.grid}>
        {offers.map((offer) => (
          <OfferList
            key={offer.id}
            offer={offer}
            ownerPhoto={ownerPhoto}
            mainImage={mainImage}
            onDeleteSuccess={handleDeleteStateUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default MyOffers;
