import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles.module.css";
import logo from "../../assets/images/logo.png";
import api from '../../services/api'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

 
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (!validateEmail(email)) {
    alert("Email inválido. Verifique o formato.");
    return;
  }

 
  if (password.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  try {
  const { data } = await api.post('/auth', {
    email,
    password
  });

  const { token, user } = data;

  // Armazenar o token e o usuário no localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  console.log("Token:", token);
  console.log("Usuário:", user);

    navigate('/home')
  }catch{
    alert('Senha ou email incorretos!')
  }
  
 
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

        <p className={styles.registerLink}>
          Não tem uma conta? <Link to="/Register">Cadastre-se aqui</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;