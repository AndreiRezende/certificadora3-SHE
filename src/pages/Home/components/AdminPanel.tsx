import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';

interface AdminPanelProps {
  onModerate: (id: string, status: Idea['status']) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onModerate }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_PASSWORD = 'admin'; // senha simples para admin

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
      console.log('🔍 Buscando ideias do backend...');
      
      // Teste com diferentes URLs para descobrir qual funciona
      const possibleUrls = [
        '/search/admin/allIdeias',
        'http://localhost:3000/search/admin/allIdeias',
        'http://localhost:5000/search/admin/allIdeias',
        'http://localhost:8000/search/admin/allIdeias',
        '/api/search/admin/allIdeias'
      ];
      
      console.log('🌐 Tentando URL:', possibleUrls[0]);
      
      const response = await axios.get('http://localhost:3000/search/admin/allIdeias', {
        headers: {
          'Authorization': 'Admin',
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos de timeout
      });
      
      console.log('📦 Resposta completa do backend:', response);
      console.log('📋 Dados recebidos:', response.data);
      console.log('📊 Tipo dos dados:', typeof response.data);
      console.log('📈 É array?', Array.isArray(response.data));
      console.log('📄 Status da resposta:', response.status);
      console.log('🔗 URL final chamada:', response.config.url);
      
      if (typeof response.data === 'string') {
        console.log('⚠️ Recebido string em vez de JSON. Primeiros 500 chars:', response.data.substring(0, 500));
        console.log('🔍 Parece HTML?', response.data.includes('<html>'));
        setError('Servidor retornou HTML em vez de JSON. Verifique se a API está funcionando.');
        return;
      }
      
      if (Array.isArray(response.data)) {
        console.log('✅ Total de ideias recebidas:', response.data.length);
        response.data.forEach((idea, index) => {
          console.log(`💡 Ideia ${index + 1}:`, {
            id: idea.id,
            title: idea.title,
            status: idea.status,
            category: idea.category
          });
        });
        setIdeas(response.data);
      } else {
        console.log('❌ Dados não são um array:', response.data);
        setIdeas([]);
        setError('Formato de dados inválido recebido do servidor.');
      }
    } catch (error: any) {
      console.error('❌ Erro completo ao buscar ideias:', error);
      console.error('📝 Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
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
      console.log('✅ Aprovando ideia:', id);
      
      const response = await axios.put(`http://localhost:3000/search/admin/approveIdeia/${id}`, {}, {
        headers: {
          'Authorization': 'Admin',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📝 Resposta da aprovação:', response.data);
      
      // Atualizar a lista após aprovação
      await fetchIdeas();
      
      // Optional: Show success message
      console.log('🎉 Ideia aprovada com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro ao aprovar ideia:', error);
      setError(`Erro ao aprovar ideia: ${error.response?.data?.msg || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Substitua a função handleReject no seu AdminPanel por esta versão corrigida:

const handleReject = async (id: string) => {
  try {
    setLoading(true);
    console.log('❌ Rejeitando ideia:', id);
    
    // MUDANÇA: Usar DELETE em vez de PUT
    const response = await axios.delete(`http://localhost:3000/search/admin/delete/${id}`, {
      headers: {
        'Authorization': 'Admin',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📝 Resposta da rejeição:', response.data);
    
    // Atualizar a lista após rejeição
    await fetchIdeas();
    
    // Optional: Show success message
    console.log('🗑️ Ideia rejeitada com sucesso!');
    
  } catch (error: any) {
    console.error('❌ Erro ao rejeitar ideia:', error);
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

  // Filtrar apenas ideias em análise (caso o backend não faça isso)
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