import { useEffect, useState } from "react"

function OrderHistory(){
    const [order,setOrders] = useState([]);

    useEffect(()=>{
        const fetchOrders = async () =>{
            try {
                const token = localStorage.getItem("authToken");
                if(!token) return (window.location.href="https://nord-storm.onrender.com/auth/googl")

                const response = await fetch(`https://nord-storm.onrender.com/allOrders`,{
                    headers:{Authorization : `Bearer ${token}`},
                })

                const data = await response.json();
                if(response.ok){
                    setOrders(data);
                }
                else{
                    alert("Error fetching orders");
                }
            } catch (error) {
                console.error("Fetch orders error:", error)
            }
        }
        fetchOrders()
    },[])
    return (
        <div style={{ padding: "20px" }}>
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <h3>Order ID: {order._id}</h3>
                <p>Status: {order.orderStatus}</p>
                <p>Total Amount: ₹{order.totalAmount}</p>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - ₹{item.price} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      );
}