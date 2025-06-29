import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';

interface ApprovedIdeasProps {
  // Removemos a dependência de receber ideas como prop
  // O componente vai buscar as próprias ideias
}

const ApprovedIdeas: React.FC<ApprovedIdeasProps> = () => {
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingIdea, setVotingIdea] = useState<string | null>(null);

  // Buscar ideias aprovadas do backend
  const fetchApprovedIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token'); // Assumindo que você armazena o token no localStorage
      
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      const response = await axios.get('http://localhost:3000/search/getIdeia', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📋 Ideias recebidas:', response.data);
      
      // Filtrar apenas ideias aprovadas
      const approvedIdeas = response.data.filter((idea: Idea) => idea.status === 'Aprovada');
      setIdeas(approvedIdeas);
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar ideias:', error);
      
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (error.response?.status === 403) {
        setError('Acesso negado.');
      } else {
        setError(`Erro ao carregar ideias: ${error.response?.data?.msg || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para votar em uma ideia
  const handleVote = async (ideaId: string) => {
    try {
      setVotingIdea(ideaId);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      const response = await axios.post(`http://localhost:3000/search/vote/${ideaId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Voto registrado:', response.data);
      
      // Atualizar a lista de ideias para refletir o novo número de votos
      await fetchApprovedIdeas();
      
      // Opcional: Mostrar mensagem de sucesso
      console.log('🎉 Voto registrado com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro ao votar:', error);
      
      if (error.response?.status === 403) {
        setError(error.response.data.msg || 'Você não pode votar nesta ideia.');
      } else if (error.response?.status === 404) {
        setError('Ideia não encontrada.');
      } else {
        setError(`Erro ao registrar voto: ${error.response?.data?.msg || error.message}`);
      }
    } finally {
      setVotingIdea(null);
    }
  };

  // Carregar ideias quando o componente montar
  useEffect(() => {
    fetchApprovedIdeas();
  }, []);

  // Filtrar ideias por categoria
  const filteredIdeas = categoryFilter === 'Todas' 
    ? ideas 
    : ideas.filter(idea => idea.category === categoryFilter);

  if (loading) {
    return (
      <section className={styles.ideasListSection}>
        <h2 className={styles.sectionTitle}>Ideias Aprovadas</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Carregando ideias...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.ideasListSection}>
      <h2 className={styles.sectionTitle}>Ideias Aprovadas</h2>
      
      {error && (
        <div style={{ 
          color: '#d32f2f', 
          backgroundColor: '#ffebee', 
          padding: '1rem', 
          borderRadius: '4px', 
          margin: '1rem 0',
          textAlign: 'center'
        }}>
          {error}
          <button 
            onClick={fetchApprovedIdeas} 
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#5a2d8a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}
      
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
        
        <button 
          onClick={fetchApprovedIdeas}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5a2d8a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
      
      <div className={styles.ideasListContainer}>
        {filteredIdeas.length === 0 ? (
          <div className={styles.noResults}>
            <img src="/empty-state.svg" alt="Nenhuma ideia encontrada" className={styles.emptyImage} />
            <p>
              {ideas.length === 0 
                ? 'Nenhuma ideia aprovada disponível para votação.' 
                : `Nenhuma ideia aprovada encontrada${categoryFilter !== 'Todas' ? ' para esta categoria' : ''}.`
              }
            </p>
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
                  onClick={() => handleVote(idea.id)}
                  className={styles.voteButton}
                  disabled={votingIdea === idea.id}
                  style={{
                    opacity: votingIdea === idea.id ? 0.6 : 1,
                    cursor: votingIdea === idea.id ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span className={styles.voteIcon}>👍</span>
                  <span className={styles.voteCount}>
                    {votingIdea === idea.id ? '...' : idea.votes || 0}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {filteredIdeas.length > 0 && (
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          fontSize: '0.9rem', 
          color: '#666' 
        }}>
          {filteredIdeas.length} ideia{filteredIdeas.length !== 1 ? 's' : ''} disponível{filteredIdeas.length !== 1 ? 'eis' : ''} para votação
        </div>
      )}
    </section>
  );
};

export default ApprovedIdeas;