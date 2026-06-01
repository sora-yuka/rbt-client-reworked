import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { OfferCard } from "../../components";
import { getCategoryName } from "../../utils/formatters";
import styles from "./home.module.css";

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await api.get("/api/v1/offers/");
        setOffers(response.data);
      } catch (err) {
        console.error("Failed to load offers: ", err);
      }
    };

    loadOffers();
  }, []);

  const categories = useMemo(() => {
    const name = offers.map(getCategoryName).filter(Boolean);
    return ["all", ...Array.from(new Set(name))];
  }, [offers]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default Home;
