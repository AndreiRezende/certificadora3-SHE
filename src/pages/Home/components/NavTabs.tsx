import React from 'react';
import styles from '../styles.module.css';

type Tab = 'submit' | 'ideas' | 'ranking' | 'admin';

interface NavTabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavTabs: React.FC<NavTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.tabButton} ${activeTab === 'submit' ? styles.active : ''}`}
        onClick={() => setActiveTab('submit')}
      >
        Enviar Ideia
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'ideas' ? styles.active : ''}`}
        onClick={() => setActiveTab('ideas')}
      >
        Ideias Aprovadas
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'ranking' ? styles.active : ''}`}
        onClick={() => setActiveTab('ranking')}
      >
        Ranking
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'admin' ? styles.active : ''}`}
        onClick={() => setActiveTab('admin')}
      >
        Painel Administrativo
      </button>
    </nav>
  );
};

export default NavTabs;