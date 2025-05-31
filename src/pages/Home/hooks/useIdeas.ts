import { useState, useEffect } from 'react';
import type { Idea } from '../types/idea';

const STORAGE_KEY = 'md_ideas';
const ADMIN_PASSWORD = 'certificadora3';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentUserId] = useState('user-' + Math.random().toString(36).substr(2, 9));
    
  useEffect(() => {
    const loadIdeas = () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
      } catch {
        return [];
      }
    };
    setIdeas(loadIdeas());
  }, []);

  const saveIdeas = (newIdeas: Idea[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdeas));
    setIdeas(newIdeas);
  };

  const addIdea = (newIdea: Omit<Idea, 'id' | 'status' | 'votes'>) => {
    const idea: Idea = {
      ...newIdea,
      id: `id-${Math.random().toString(36).substr(2, 9)}`,
      status: 'Em análise',
      votes: 0
    };
    saveIdeas([...ideas, idea]);
  };

  const voteIdea = (id: string) => {
    const updated = ideas.map(idea => 
      idea.id === id ? { ...idea, votes: (idea.votes || 0) + 1 } : idea
    );
    saveIdeas(updated);
  };

  const moderateIdea = (id: string, status: Idea['status']) => {
    const updated = ideas.map(idea => 
      idea.id === id ? { ...idea, status } : idea
    );
    saveIdeas(updated);
  };

  return { ideas, addIdea, voteIdea, moderateIdea };
};