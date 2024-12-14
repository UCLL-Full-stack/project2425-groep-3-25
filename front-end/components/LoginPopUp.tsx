import React, { useState } from "react";
import styles from "../styles/LoginPopUp.module.css";

interface LoginPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (formData: RegisterFormData) => void;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  role: "employee" | "partner";
  location?: string;
  companyName?: string;
  companyValidationInfo?: string;
  preferredContactMethod?: string;
}

const LoginPopUp: React.FC<LoginPopUpProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<"choice" | "login" | "register">("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "employee",
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    onLogin(email, password);
    resetForm();
    onClose();
  };

  const handleRegister = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.role === "partner" && (!formData.companyName || !formData.location)) {
      setError("Please fill in all partner-specific fields.");
      return;
    }
    onRegister(formData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "employee",
    });
    setMode("choice");
    setError(null);
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
                  role: e.target.value as "employee" | "partner",
                })
              }
              className={styles["popup-input"]}
              required
            >
              <option value="employee">Employee</option>
              <option value="partner">Partner</option>
            </select>

            {formData.role === "partner" && (
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
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className={styles["popup-input"]}
                  placeholder="Enter location"
                  required
                />

                <label className={styles["label-popUp"]}>
                  Company Validation Info:
                </label>
                <textarea
                  value={formData.companyValidationInfo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyValidationInfo: e.target.value,
                    })
                  }
                  className={styles["popup-input"]}
                  placeholder="Provide information to validate the company"
                  rows={3}
                  required
                />

                <label className={styles["label-popUp"]}>
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
                </select>
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
