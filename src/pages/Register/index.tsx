import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./style.module.css";
import logo from "../../assets/images/logo.png";
import api from '../../services/api'

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const validateCPF = (cpf: string): boolean => {
    const cpfClean = cpf.replace(/[^\d]+/g, "");
    if (cpfClean.length !== 11 || /^(\d)\1+$/.test(cpfClean)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpfClean.charAt(i)) * (10 - i);
    let check = 11 - (sum % 11);
    if (check === 10 || check === 11) check = 0;
    if (check !== parseInt(cpfClean.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpfClean.charAt(i)) * (11 - i);
    check = 11 - (sum % 11);
    if (check === 10 || check === 11) check = 0;
    return check === parseInt(cpfClean.charAt(10));
  };

  const validatePhone = (phone: string): boolean => {
    const regex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return regex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validatePhone(phone)) {
      alert("Telefone inválido! Use o formato (xx) xxxxx-xxxx");
      return;
    }

    if (!validateCPF(cpf)) {
      alert("CPF inválido!");
      return;
    }

    if (!validateEmail(email)) {
      alert("Email inválido!");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      await api.post('/auth/register', {
        name,
        phone,
        cpf,
        email,
        password,
        confirmPassword
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/Login");
    } catch (error: any) {
  if (error.response && error.response.data) {
    const message = error.response.data.message || "Erro ao cadastrar usuário.";

    
    if (Array.isArray(error.response.data)) {
      alert(error.response.data.join("\n"));
    } else {
      alert(message);
    }
  } else {
    alert("Erro ao cadastrar usuário. Tente novamente.");
  }
  console.error(error);
}

  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.contentContainer}>
          <img src={logo} alt="SHE - Shape Her Era" className={styles.logoImg} />
        </div>
      </div>

      <div className={styles.registerCard}>
        <h2 className={styles.registerTitle}>Cadastro</h2>

        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome completo:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefone:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="(xx) xxxxx - xxxx"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
              placeholder="Digite seu CPF"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirme sua senha:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Digite sua confirmação de senha"
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            Cadastrar
          </button>
        </form>

        <p className={styles.registerLink}>
          Já tem uma conta? <Link to="/Login">Faça o Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
