import React, { useState } from 'react';
import styles from './styles.module.css';
import NavTabs from './components/NavTabs';
import IdeaForm from './components/IdeaForm';
import ApprovedIdeas from './components/ApprovedIdeas';
import Ranking from './components/Ranking';
import AdminPanel from './components/AdminPanel';
import { useIdeas } from './hooks/useIdeas';

const Home = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'ideas' | 'ranking' | 'admin'>('submit');
  const { ideas, addIdea, voteIdea, moderateIdea } = useIdeas();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'submit':
        return <IdeaForm onSubmit={addIdea} />;
      case 'ideas':
        return <ApprovedIdeas ideas={ideas} onVote={voteIdea} />;
      case 'ranking':
        return <Ranking ideas={ideas} />;
      case 'admin':
        return <AdminPanel ideas={ideas} onModerate={moderateIdea} />;
      default:
        return <IdeaForm onSubmit={addIdea} />;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Meninas Digitais - Plataforma de Ideias</h1>
      </header>
      
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className={styles.main}>
        <div className={styles.activeSection}>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Home;