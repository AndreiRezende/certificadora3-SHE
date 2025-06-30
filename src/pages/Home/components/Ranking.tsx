import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';


const Ranking = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      
      const response = await axios.get('http://localhost:3000/search/ranking', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setIdeas(response.data);
      
    } catch (error: any) {
      
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (error.response?.status === 403) {
        setError('Acesso negado.');
      } else {
        setError(`Erro ao carregar ranking: ${error.response?.data?.msg || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchRanking();
  }, []);

  
  const getPositionEmoji = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };


  const getPositionClass = (position: number) => {
    switch (position) {
      case 1: return styles.firstPlace;
      case 2: return styles.secondPlace;
      case 3: return styles.thirdPlace;
      default: return '';
    }
  };

  if (loading) {
    return (
      <section aria-label="Ranking das ideias mais votadas">
        <h2 className={styles.rankingHeader}>Ranking das Ideias Mais Votadas</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Carregando ranking...</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Ranking das ideias mais votadas">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className={styles.rankingHeader}>🏆 Ranking das Ideias Mais Votadas</h2>
        <button 
          onClick={fetchRanking}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#5a2d8a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontSize: '0.9rem'
          }}
        >
          {loading ? 'Atualizando...' : 'Atualizar Ranking'}
        </button>
      </div>

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
            onClick={fetchRanking} 
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
      
      <div className={styles.rankingList}>
        {ideas.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🏆</p>
            <p>Nenhuma ideia no ranking ainda.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              As ideias aparecerão aqui quando receberem votos!
            </p>
          </div>
        ) : (
          <>
            {ideas.map((idea, index) => {
              const position = index + 1;
              return (
                <div 
                  key={idea.id} 
                  className={`${styles.rankingItem} ${getPositionClass(position)}`}
                  style={{
                    background: position <= 3 
                      ? `linear-gradient(135deg, ${
                          position === 1 ? '#ffd700, #ffed4e' : 
                          position === 2 ? '#c0c0c0, #e8e8e8' : 
                          '#cd7f32, #daa520'
                        })` 
                      : undefined,
                    border: position <= 3 ? '2px solid #fff' : undefined,
                    boxShadow: position <= 3 ? '0 4px 8px rgba(0,0,0,0.2)' : undefined,
                    transform: position === 1 ? 'scale(1.02)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span 
                      className={styles.rankingPosition}
                      style={{
                        fontSize: position <= 3 ? '1.5rem' : '1.2rem',
                        fontWeight: position <= 3 ? 'bold' : 'normal'
                      }}
                    >
                      {getPositionEmoji(position)} #{position}
                    </span>
                    <div style={{ flex: 1 }}>
                      <span 
                        className={styles.rankingTitle}
                        style={{
                          fontWeight: position <= 3 ? 'bold' : 'normal',
                          fontSize: position === 1 ? '1.1rem' : undefined
                        }}
                      >
                        {idea.title}
                      </span>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: position <= 3 ? '#333' : '#666',
                        marginTop: '0.2rem' 
                      }}>
                        Categoria: <strong>{idea.category}</strong>
                      </div>
                    </div>
                  </div>
                  <span 
                    className={styles.rankingVotes}
                    style={{
                      fontWeight: position <= 3 ? 'bold' : 'normal',
                      fontSize: position <= 3 ? '1.1rem' : undefined,
                      color: position <= 3 ? '#333' : undefined
                    }}
                  >
                    👍 {idea.votes} {idea.votes === 1 ? 'voto' : 'votos'}
                  </span>
                </div>
              );
            })}
            
            {/* Estatísticas do ranking */}
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#5a2d8a', marginBottom: '1rem', fontSize: '1.1rem' }}>
                📊 Estatísticas do Ranking
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '1rem',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                <div>
                  <strong style={{ color: '#5a2d8a' }}>
                    {ideas.length}
                  </strong>
                  <br />
                  {ideas.length === 1 ? 'Ideia no ranking' : 'Ideias no ranking'}
                </div>
                <div>
                  <strong style={{ color: '#5a2d8a' }}>
                    {ideas.reduce((total, idea) => total + idea.votes, 0)}
                  </strong>
                  <br />
                  Total de votos
                </div>
                {ideas.length > 0 && (
                  <div>
                    <strong style={{ color: '#5a2d8a' }}>
                      {Math.round(ideas.reduce((total, idea) => total + idea.votes, 0) / ideas.length * 10) / 10}
                    </strong>
                    <br />
                    Média de votos
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Ranking;