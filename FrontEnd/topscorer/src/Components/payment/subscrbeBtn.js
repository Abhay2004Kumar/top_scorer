// import React from "react";
// import axios from "axios";

// const SubscribeBtn = () => {
//   const handleSubscribe = async () => {
//     try {
//       const res = await axios.post("https://top-scorer.onrender.com/api/v1/payment/create-checkout-session");
      
//       if (res.data.url) {
//         window.location.href = res.data.url;
//       } else {
//         alert("Something went wrong!");
//       }
//     } catch (err) {
//       console.error("Axios error creating checkout session:", err);
//       alert("Unable to start checkout session. Please try again.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", margin: "30px 0" }}>
//       <button 
//         onClick={handleSubscribe} 
//         style={{
//           backgroundColor: "#FF5A5F",
//           color: "#fff",
//           border: "none",
//           padding: "12px 24px",
//           borderRadius: "8px",
//           cursor: "pointer",
//           fontSize: "1.1rem"
//         }}
//       >
//         Subscribe for ₹199/month
//       </button>
//     </div>
//   );
// };

// export default SubscribeBtn;



import React from "react";
import axios from "axios";

const SubscribeBtn = () => {
  const handleSubscribe = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You must be logged in to subscribe.");
      return;
    }

    try {
      const res = await axios.post(
        "https://top-scorer.onrender.com/api/v1/payment/create-checkout-session",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to start checkout.");
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "30px 0" }}>
      <button
        onClick={handleSubscribe}
        style={{
          backgroundColor: "#FF5A5F",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1.1rem",
        }}
      >
        Subscribe for ₹199/month
      </button>
    </div>
  );
};

export default SubscribeBtn;
