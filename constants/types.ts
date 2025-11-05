// User Profile Types
export type UserProfile = {
  name: string;
  salary: number;
  payFrequency: 'Weekly' | 'Bi-weekly' | 'Semi-monthly' | 'Monthly';
};

// Expense Types
export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
};

// Paycheck Plan Item Types
export type PaycheckPlanItem = {
  billId: string;
  name: string;
  totalAmount: number;
  amountToSetAside: number;
  dueDay: number;
  isSaved: boolean;
};