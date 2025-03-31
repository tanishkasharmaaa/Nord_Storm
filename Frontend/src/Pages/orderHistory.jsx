import { useEffect, useState } from "react";
import axios from 'axios'

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("authToken");

const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token
  
        if (!token) {
          console.error("No auth token found!");
          return;
        }
  
        const response = await fetch("https://nord-storm.onrender.com/products/allOrders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };


  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`https://nord-storm.onrender.com/products/orderDelete/${orderId}`, {
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


  useEffect(() => {
  fetchOrders();
  }, []); // Empty dependency array to run only on mount
  

  return (
    <div className="orders-container">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.hgh</p>
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
