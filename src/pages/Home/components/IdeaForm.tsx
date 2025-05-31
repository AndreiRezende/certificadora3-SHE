import React, { useState } from 'react';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';

interface IdeaFormProps {
  onSubmit: (idea: Omit<Idea, 'id' | 'status' | 'votes'>) => void;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onSubmit({ title, description, category });
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
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