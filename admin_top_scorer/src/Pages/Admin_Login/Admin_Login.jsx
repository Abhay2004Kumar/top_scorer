import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Admin.module.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

const image =
  "https://images.pexels.com/photos/9153468/pexels-photo-9153468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
function Admin_Login({ setChange, setusername }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = window.location;

  // Check if user is already logged in
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/validateToken`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.success) {
          setusername(res.data.data.user.username);
          // Redirect to the intended path or default to '/badminton'
          const from = location.state?.from || '/badminton';
          navigate(from, { replace: true });
        } else {
          throw new Error("Token invalid");
        }
      })
      .catch(() => {
        // Backend rejected token → clear everything
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
    }
  }, [navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDemoUser = async (e) => {
    e?.preventDefault();
    const demoCredentials = { username: "abhay", password: "1234" };
    
    // Use the demo credentials directly in the login call
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/loginAdmin`,
        demoCredentials,
        {withCredentials: true}
      );

      if (response.data && response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        toast.success("Login Successful!");

        // Store tokens securely
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setusername(user.username);
        setChange(prev => !prev);
        // Redirect to the intended path or default to '/badminton'
        const from = location.state?.from || '/badminton';
        navigate(from, { replace: true });
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during demo login:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (loading || !formData.username || !formData.password) return; // Prevent multiple submissions and empty submissions
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/loginAdmin`,
        formData,
        {withCredentials: true}
      );

      if (response.data && response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        toast.success("Login Successful!");

        // Store tokens securely
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setusername(user.username);
        setChange(prev => !prev);
        // Redirect to the intended path or default to '/badminton'
        const from = location.state?.from || '/badminton';
        navigate(from, { replace: true });
        window.location.reload(); // Force a refresh to re-render the app
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* Left side: Image */}
      <div className={styles.carousel}>
        <img src={image} alt="Carousel" className={styles.image} />
      </div>

      {/* Right side: Login Form */}
      <div className={styles.loginForm}>
        <h2 className={styles.header}>Welcome to Admin Panel</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <PropagateLoader className="mb-[4%] p-2" /> : <p className="text-[20px] font-semibold">Login</p>}
          </button>
          <button
            type="button"
            onClick={handleDemoUser}
            className={`${styles.demoButton} ${loading ? styles.disabled : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <PropagateLoader color="#ffffff" size={8} />
                <span className="ml-2">Logging in...</span>
              </div>
            ) : (
              ''
            )}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.info}>
          If you don't know credentials please contact site owners. The score
          updation requires admin username and password.<br></br>
          <button className=" underline text-blue-600 text-[16px]" onClick={handleDemoUser}>
            Enter as Demo User
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin_Login;
