export enum BudgetType {
  MONTHLY = 'mensual',
  WEEKLY = 'semanal',
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  type: BudgetType;
}

export interface BudgetState {
  monthlyLimit: number;
  weeklyLimit: number;
  categories: Category[];
  expenses: Expense[];
}
