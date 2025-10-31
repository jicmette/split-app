// User Profile Types
export type UserProfile = {
  name: string;
  salary: number;
  payFrequency: 'Weekly' | 'Bi-weekly' | 'Semi-monthly' | 'Monthly';
};

// Expense Types
export type Expense = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
};