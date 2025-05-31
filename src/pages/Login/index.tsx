import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import logo from "../../assets/images/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação aqui
    console.log("Email:", email, "Password:", password);
    navigate("/home");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.contentContainer}>
          <img 
            src={logo} 
            alt="SHE - Shape Her Era" 
            className={styles.logoImg}
            />
        </div>
      </div>
      
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Banco de Ideias</h2>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>

        <p className={styles.footerText}> "Nós ensinamos as meninas a serem perfeitas. Devíamos ensiná-las a serem corajosas." - Reshma Saujani</p>
      </div>
    </div>
  );
};

export default Login;