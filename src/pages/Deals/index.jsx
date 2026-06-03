import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import { DealCard } from "../../components";
import styles from "./deals.module.css";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDeals = async () => {
    try {
      const response = await api.get("/api/v1/deals/");
      setDeals(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleStatusUpdate = (updatedDeal) => {
    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.id === updatedDeal.id ? updatedDeal : deal,
      ),
    );
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading deals...</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Deals</h3>
      <div className={styles.grid}>
        {deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              currentUser={user?.username}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        ) : (
          <div className={styles.emptyState}>No deals found.</div>
        )}
      </div>
    </div>
  );
};

export default Deals;
