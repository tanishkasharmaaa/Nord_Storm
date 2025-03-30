import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://your-api.com/allOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`https://your-api.com/orderDelete/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Order cancelled successfully!");
        setOrders(orders.filter(order => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="orders-container">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>
            <p>Status: <strong>{order.orderStatus}</strong></p>
            <p>Total: ₹{order.totalAmount}</p>
            {order.orderStatus === "Processing" && (
              <button onClick={() => cancelOrder(order._id)}>Cancel Order</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
