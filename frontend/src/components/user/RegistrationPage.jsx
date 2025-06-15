import { useState } from "react";
import "./RegistrationPage.css";
import Error from "../ui/Error";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => { 
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userInfo = {
    username,
    email,
    password,
    city,
    state,
    address,
    phone,
    country,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    api
      .post("register/", userInfo) // Replace with the appropriate registration endpoint
      .then((res) => {
        console.log(res.data);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCity("");
        setState("");
        setAddress("");
        setPhone("");
        setCountry("");
        setLoading(false);
        navigate("/login"); // Redirect to login page after successful registration
      })
      .catch((err) => {
        console.log(err.message);
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="registration-container my-5">
      <div className="registration-card shadow">
        {error && <Error error={error} />}
        <h2 className="registration-title">Create an Account</h2>
        <p className="registration-subtitle">Please fill in the details below</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              id="username"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
              id="city"
              placeholder="Enter your city"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="form-control"
              id="state"
              placeholder="Enter your state"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="address"
              placeholder="Enter your address"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="phone"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-control"
              id="country"
              placeholder="Enter your country"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            Register
          </button>
        </form>
        <div className="registration-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
