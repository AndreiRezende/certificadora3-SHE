import React from 'react';
import styles from '../styles.module.css';
import type { Idea } from '../types/idea';

interface RankingProps {
  ideas: Idea[];
}

const Ranking: React.FC<RankingProps> = ({ ideas }) => {
  const approvedIdeas = ideas.filter(idea => idea.status === 'Aprovada');
  const sortedIdeas = [...approvedIdeas].sort((a, b) => b.votes - a.votes);

  return (
    <section aria-label="Ranking das ideias mais votadas">
      <h2 className={styles.rankingHeader}>Ranking das Ideias Mais Votadas</h2>
      
      <div className={styles.rankingList}>
        {sortedIdeas.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Nenhuma ideia aprovada ainda para exibir ranking.
          </p>
        ) : (
          <>
            {sortedIdeas.map((idea, index) => (
              <div key={idea.id} className={styles.rankingItem}>
                <span className={styles.rankingPosition}>#{index + 1}</span>
                <span className={styles.rankingTitle}>{idea.title}</span>
                <span className={styles.rankingVotes}>
                  {idea.votes} {idea.votes === 1 ? 'voto' : 'votos'}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Ranking;