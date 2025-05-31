import React, { useState } from 'react';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';

interface AdminPanelProps {
  ideas: Idea[];
  onModerate: (id: string, status: Idea['status']) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ ideas, onModerate }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ADMIN_PASSWORD = 'certificadora3';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Senha incorreta! Tente novamente.');
    }
  };

  const pendingIdeas = ideas.filter(idea => idea.status === 'Em análise');

  return (
    <section aria-label="Painel administrativo">
      <h2 className={styles.rankingHeader}>Painel Administrativo</h2>
      
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className={styles.adminForm}>
          <label htmlFor="adminPassword">Senha de Acesso</label>
          <input
            type="password"
            id="adminPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite a senha"
          />
          <small style={{ display: 'block', marginTop: '-1rem', marginBottom: '1.5rem', color: '#666' }}>
            Senha protótipo: <strong>certificadora3</strong>
          </small>
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <div className={styles.adminContent}>
          <h3 style={{ color: '#5a2d8a', marginBottom: '1.5rem' }}>
            Ideias aguardando moderação ({pendingIdeas.length})
          </h3>
          
          {pendingIdeas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Não há ideias para moderação no momento.
            </p>
          ) : (
            <div className={styles.adminIdeasList}>
              {pendingIdeas.map(idea => (
                <div key={idea.id} className={styles.adminIdeaCard}>
                    <h4 className={styles.adminIdeaTitle}>{idea.title}</h4>
                    <p className={styles.adminIdeaDesc}>{idea.description}</p>
                    <p className={styles.adminIdeaMeta}>
                        Área: <strong>{idea.category}</strong>
                    </p>
                    <div className={styles.adminActions}>
                        <button 
                        onClick={() => onModerate(idea.id, 'Aprovada')}
                        className={styles.approveButton}
                        >
                        Aprovar
                        </button>
                        <button 
                        onClick={() => onModerate(idea.id, 'Rejeitada')}
                        className={styles.rejectButton}
                        >
                        Rejeitar
                        </button>
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AdminPanel;