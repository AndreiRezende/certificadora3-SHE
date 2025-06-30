import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_PASSWORD = 'admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      setError(null);
    } else {
      setError('Senha incorreta! Tente novamente.');
    }
  };

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/search/admin/allIdeias', {
        headers: {
          'Authorization': 'Admin',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (typeof response.data === 'string') {
        setError('Servidor retornou HTML em vez de JSON. Verifique se a API está funcionando.');
        return;
      }

      if (Array.isArray(response.data)) {
        setIdeas(response.data);
      } else {
        setIdeas([]);
        setError('Formato de dados inválido recebido do servidor.');
      }
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else if (error.response?.status === 404) {
        setError('Rota não encontrada. Verifique se o endpoint está correto.');
      } else if (error.response?.status >= 500) {
        setError('Erro interno do servidor. Verifique os logs do backend.');
      } else {
        setError(`Erro ao buscar ideias: ${error.response?.status || 'Conexão'} - ${error.message}`);
      }
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchIdeas();
    }
  }, [isAuthenticated]);

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/search/admin/approveIdeia/${id}`, {}, {
        headers: {
          'Authorization': 'Admin',
          'Content-Type': 'application/json'
        }
      });
      await fetchIdeas();
    } catch (error: any) {
      setError(`Erro ao aprovar ideia: ${error.response?.data?.msg || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/search/admin/delete/${id}`, {
        headers: {
          'Authorization': 'Admin',
          'Content-Type': 'application/json'
        }
      });
      await fetchIdeas();
    } catch (error: any) {
      setError(`Erro ao rejeitar ideia: ${error.response?.data?.message || error.response?.data?.msg || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIdeas([]);
    setError(null);
  };

  const pendingIdeas = ideas.filter((idea) => idea.status === 'Em análise');

  if (!isAuthenticated) {
    return (
      <section aria-label="Login do Painel Administrativo">
        <h2 className={styles.rankingHeader}>Login Administrativo</h2>
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
          </div>
        )}
        <form onSubmit={handleLogin} className={styles.adminForm}>
          <label htmlFor="adminPassword">Senha de Acesso</label>
          <input
            type="password"
            id="adminPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite a senha"
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>
            Entrar
          </button>
        </form>
      </section>
    );
  }

  return (
    <section aria-label="Painel administrativo">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className={styles.rankingHeader}>Painel Administrativo</h2>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>

      <div className={styles.adminContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#5a2d8a', margin: 0 }}>
            Ideias aguardando moderação ({pendingIdeas.length})
          </h3>
          <button 
            onClick={fetchIdeas}
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
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            <p>Carregando ideias...</p>
          </div>
        ) : pendingIdeas.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            <p>Não há ideias para moderação no momento.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {ideas.length > 0 ? 'Todas as ideias já foram moderadas.' : 'Nenhuma ideia encontrada no banco de dados.'}
            </p>
          </div>
        ) : (
          <div className={styles.adminIdeasList}>
            {pendingIdeas.map((idea) => (
              <div key={idea.id} className={styles.adminIdeaCard}>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 className={styles.adminIdeaTitle}>{idea.title}</h4>
                  <p className={styles.adminIdeaDesc}>{idea.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                    <p className={styles.adminIdeaMeta}>
                      Área: <strong>{idea.category}</strong>
                    </p>
                    <p>
                      Status: <strong style={{ color: '#ff9800' }}>{idea.status}</strong>
                    </p>
                    {idea.createdAt && (
                      <p>
                        Criada em: <strong>{new Date(idea.createdAt).toLocaleDateString('pt-BR')}</strong>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className={styles.adminActions}>
                  <button
                    onClick={() => handleApprove(idea.id)}
                    className={styles.approveButton}
                    disabled={loading}
                  >
                    {loading ? '...' : '✓ Aprovar'}
                  </button>
                  <button
                    onClick={() => handleReject(idea.id)}
                    className={styles.rejectButton}
                    disabled={loading}
                  >
                    {loading ? '...' : '✗ Rejeitar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingIdeas.length > 0 && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            Total de ideias carregadas: {ideas.length} | Em análise: {pendingIdeas.length}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
