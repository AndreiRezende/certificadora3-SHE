import React, { useState } from 'react';
import styles from '../styles.module.css';
import api from '../../../services/api'

const IdeaForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para enviar uma ideia.");
      return;
    }

    try {
      const response = await api.post(
        "/search/ideia",
        {
          title,
          description,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 Envia o token
          },
        }
      );

      alert("Ideia enviada com sucesso!");

      
      setTitle('');
      setDescription('');
      setCategory('');
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar ideia. Verifique se você está logado.");
    }
  };

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Envie sua ideia</h2>

      <form onSubmit={handleSubmit} className={styles.ideaForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.formLabel}>Título</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.formInput}
            required
            maxLength={80}
            placeholder="Dê um título criativo à sua ideia"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.formTextarea}
            required
            maxLength={600}
            placeholder="Descreva sua ideia com detalhes..."
            rows={6}
          />
          <small className={styles.charCounter}>
            {description.length}/600 caracteres
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.formLabel}>Área STEM</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.formSelect}
            required
          >
            <option value="" disabled>Selecione uma área</option>
            <option value="Programação">Programação</option>
            <option value="Robótica">Robótica</option>
            <option value="Sustentabilidade">Sustentabilidade</option>
            <option value="Ciência">Ciência</option>
            <option value="Engenharia">Engenharia</option>
            <option value="Matemática">Matemática</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Enviar Ideia
        </button>
      </form>
    </section>
  );
};

export default IdeaForm;
