import React, { useState } from 'react';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';

interface ApprovedIdeasProps {
  ideas: Idea[];
  onVote: (id: string) => void;
}

const ApprovedIdeas: React.FC<ApprovedIdeasProps> = ({ ideas, onVote }) => {
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const approvedIdeas = ideas.filter(idea => idea.status === 'Aprovada');
  const filteredIdeas = categoryFilter === 'Todas' 
    ? approvedIdeas 
    : approvedIdeas.filter(idea => idea.category === categoryFilter);

  return (
    <section className={styles.ideasListSection}>
      <h2 className={styles.sectionTitle}>Ideias Aprovadas</h2>
      
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label htmlFor="filter-category" className={styles.filterLabel}>
            Filtrar por área:
          </label>
          <select
            id="filter-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="Todas">Todas</option>
            <option value="Programação">Programação</option>
            <option value="Robótica">Robótica</option>
            <option value="Sustentabilidade">Sustentabilidade</option>
            <option value="Ciência">Ciência</option>
            <option value="Engenharia">Engenharia</option>
            <option value="Matemática">Matemática</option>
          </select>
        </div>
      </div>
      
      <div className={styles.ideasListContainer}>
        {filteredIdeas.length === 0 ? (
          <div className={styles.noResults}>
            <img src="/empty-state.svg" alt="Nenhuma ideia encontrada" className={styles.emptyImage} />
            <p>Nenhuma ideia aprovada encontrada{categoryFilter !== 'Todas' ? ' para esta categoria' : ''}.</p>
          </div>
        ) : (
          filteredIdeas.map(idea => (
            <div key={idea.id} className={styles.ideaListItem}>
              <div className={styles.ideaContent}>
                <div className={styles.ideaHeader}>
                  <h3 className={styles.ideaTitle}>{idea.title}</h3>
                  <span className={styles.ideaCategory}>{idea.category}</span>
                </div>
                <p className={styles.ideaDescription}>{idea.description}</p>
              </div>
              <div className={styles.ideaFooter}>
                <span className={`${styles.ideaStatus} ${styles.Aprovada}`}>
                  Aprovada
                </span>
                <button 
                  onClick={() => onVote(idea.id)}
                  className={styles.voteButton}
                >
                  <span className={styles.voteIcon}>👍</span>
                  <span className={styles.voteCount}>{idea.votes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ApprovedIdeas;