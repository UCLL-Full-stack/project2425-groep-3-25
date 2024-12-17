import React, { useState } from "react";
import styles from "../styles/LoginPopUp.module.css";
import { RegisterInput, login, signUp } from "../services/UserService";

interface LoginPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (formData: RegisterInput) => void;
}

const LoginPopUp: React.FC<LoginPopUpProps> = ({
  isOpen,
  onClose,
}) => {
  // States
  const [mode, setMode] = useState<"choice" | "login" | "register">("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Employee",
  });
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
  
    try {
      const response = await login({ email, password }); // Call API login function
      console.log("Login Success:", response);
  
      localStorage.setItem("token", response.token); // Save token
      window.location.reload(); // Reload the app to update the login state
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      // General required field checks
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError("Please fill in all required fields.");
        return;
      }
  
      // Company-specific checks
      if (
        formData.role === "Company" &&
        (!formData.companyName || !formData.locatie)
      ) {
        setError("Please provide all company-specific fields (name and location).");
        return;
      }
  
      // Call the API
      await signUp(formData);
      console.log("Registration Successful");
      onClose();
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    }
  };
  


  const startLogin = () => {
    setMode("login");
    setError(null);
  };

  const startRegister = () => {
    setMode("register");
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles["popup-overlay"]}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles["popup-container"]}>
        <div className={styles["popup-header"]}>
          <h2>
            {mode === "login"
              ? "Login"
              : mode === "register"
              ? "Register"
              : "Welcome"}
          </h2>
          <button onClick={onClose} className={styles["close-button"]}>
            &times;
          </button>
        </div>

        {error && <p className={styles["error-message"]}>{error}</p>}

        {mode === "choice" && (
          <div className={styles["popup-buttons"]}>
            <button onClick={startLogin} className={styles["login-button"]}>
              Login
            </button>
            <button onClick={startRegister} className={styles["register-button"]}>
              Register
            </button>
          </div>
        )}

        {mode === "login" && (
          <div>
            <label className={styles["label-popUp"]}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles["popup-input"]}
              placeholder="Enter email"
            />

            <label className={styles["label-popUp"]}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles["popup-input"]}
              placeholder="Enter password"
            />

            <div className={styles["popup-buttons"]}>
              <button onClick={handleLogin} className={styles["login-button"]}>
                Login
              </button>
              <button
                onClick={() => setMode("choice")}
                className={styles["cancel-button"]}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {mode === "register" && (
          <div>
            <label className={styles["label-popUp"]}>First Name:</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className={styles["popup-input"]}
              placeholder="Enter first name"
              required
            />

            <label className={styles["label-popUp"]}>Last Name:</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className={styles["popup-input"]}
              placeholder="Enter last name"
              required
            />

            <label className={styles["label-popUp"]}>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={styles["popup-input"]}
              placeholder="Enter email"
              required
            />

            <label className={styles["label-popUp"]}>Role:</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "Employee" | "Company",
                })
              }
              className={styles["popup-input"]}
              required
            >
              <option value="Employee">Employee</option>
              <option value="Company">Company</option>
            </select>

            <label className={styles["label-popUp"]}>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={styles["popup-input"]}
              placeholder="Enter password"
              required
            />

            {formData.role === "Company" && (
              <>
                <label className={styles["label-popUp"]}>Company Name:</label>
                <input
                  type="text"
                  value={formData.companyName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className={styles["popup-input"]}
                  placeholder="Enter company name"
                  required
                />

                <label className={styles["label-popUp"]}>Location:</label>
                <input
                  type="text"
                  value={formData.locatie || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, locatie: e.target.value })
                  }
                  className={styles["popup-input"]}
                  placeholder="Enter location"
                  required
                />

                <label className={styles["label-popUp"]}>
                  Company description:
                </label>
                <textarea
                  value={formData.validationInfo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validationInfo: e.target.value,
                    })
                  }
                  className={styles["popup-input"]}
                  placeholder="Provide description to validate the company"
                  rows={3}
                  required
                />

                {/* <label className={styles["label-popUp"]}>
                  Preferred Contact Method:
                </label>
                <select
                  value={formData.preferredContactMethod || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContactMethod: e.target.value,
                    })
                  }
                  className={styles["popup-input"]}
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                </select> */}
              </>
            )}

            <div className={styles["popup-buttons"]}>
              <button
                onClick={handleRegister}
                className={styles["register-button"]}
              >
                Submit
              </button>
              <button
                onClick={() => setMode("choice")}
                className={styles["cancel-button"]}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPopUp;
