export type Idea = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Em análise' | 'Aprovada' | 'Rejeitada'; // Removido 'Em desenvolvimento'
  votes: number;
};