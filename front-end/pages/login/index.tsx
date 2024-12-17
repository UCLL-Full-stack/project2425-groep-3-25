import React, { useState } from "react";
import { useRouter } from "next/router";
import { login, signUp } from "@/services/UserService";
import styles from "../../styles/LoginPopUp.module.css"; // Reusing the styles from LoginPopUp
import { RegisterInput } from "@/services/UserService";

const LoginPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
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
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      sessionStorage.setItem("token", response.token);
      router.push("/"); // Redirect to the home page after login
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError("Please fill in all required fields.");
        return;
      }

      if (formData.role === "Company" && (!formData.companyName || !formData.locatie)) {
        setError("Please fill in all company-specific fields.");
        return;
      }

      await signUp(formData);
      console.log("Registration successful");
      router.push("/login");
      setMode("login"); // Redirect back to login after registration
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className={styles["popup-overlay"]}>
      <div className={styles["popup-container"]}>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {error && <p className={styles["error-message"]}>{error}</p>}

        {mode === "login" ? (
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
                onClick={() => setMode("register")}
                className={styles["register-button"]}
              >
                Switch to Register
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className={styles["label-popUp"]}>First Name:</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={styles["popup-input"]}
              placeholder="Enter first name"
              required
            />

            <label className={styles["label-popUp"]}>Last Name:</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={styles["popup-input"]}
              placeholder="Enter last name"
              required
            />

            <label className={styles["label-popUp"]}>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles["popup-input"]}
              placeholder="Enter email"
              required
            />

            <label className={styles["label-popUp"]}>Role:</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as "Employee" | "Company" | "User" })
              }
              className={styles["popup-input"]}
              required
            >
              <option value="Employee">Employee</option>
              <option value="Company">Company</option>
              <option value="User">User</option>
            </select>

            <label className={styles["label-popUp"]}>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={styles["popup-input"]}
                  placeholder="Enter company name"
                  required
                />

                <label className={styles["label-popUp"]}>Location:</label>
                <input
                  type="text"
                  value={formData.locatie || ""}
                  onChange={(e) => setFormData({ ...formData, locatie: e.target.value })}
                  className={styles["popup-input"]}
                  placeholder="Enter location"
                  required
                />

                <label className={styles["label-popUp"]}>Company description:</label>
                <textarea
                  value={formData.validationInfo || ""}
                  onChange={(e) => setFormData({ ...formData, validationInfo: e.target.value })}
                  className={styles["popup-input"]}
                  placeholder="Provide description to validate the company"
                  rows={3}
                  required
                />
              </>
            )}

            <div className={styles["popup-buttons"]}>
              <button onClick={handleRegister} className={styles["register-button"]}>
                Register
              </button>
              <button onClick={() => setMode("login")} className={styles["cancel-button"]}>
                Switch to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
