import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  Calendar, 
  TrendingDown, 
  PieChart, 
  Settings2, 
  Trash2, 
  ChevronRight,
  PlusCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BudgetType, Category, Expense } from './types';
import { DEFAULT_CATEGORIES, PASTEL_COLORS } from './constants';
import * as LucideIcons from 'lucide-react';

// Helper to render dynamic icons
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent className={className} size={20} />;
};

export default function App() {
  // State
  const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
  const [weeklyLimit, setWeeklyLimit] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<BudgetType>(BudgetType.MONTHLY);
  
  // UI State
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditLimit, setShowEditLimit] = useState(false);
  
  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('pastel_budget_data');
    if (saved) {
      const data = JSON.parse(saved);
      setMonthlyLimit(data.monthlyLimit || 0);
      setWeeklyLimit(data.weeklyLimit || 0);
      setCategories(data.categories || DEFAULT_CATEGORIES);
      setExpenses(data.expenses || []);
    }
  }, []);

  // Save data
  useEffect(() => {
    const data = { monthlyLimit, weeklyLimit, categories, expenses };
    localStorage.setItem('pastel_budget_data', JSON.stringify(data));
  }, [monthlyLimit, weeklyLimit, categories, expenses]);

  // Calculations
  const filteredExpenses = expenses.filter(e => e.type === activeTab);
  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentLimit = activeTab === BudgetType.MONTHLY ? monthlyLimit : weeklyLimit;
  const remaining = currentLimit - totalSpent;
  const percentSpent = currentLimit > 0 ? Math.min((totalSpent / currentLimit) * 100, 100) : 0;

  // Handlers
  const addExpense = (amount: number, categoryId: string, description: string) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount,
      categoryId,
      description,
      date: new Date().toISOString(),
      type: activeTab
    };
    setExpenses([newExpense, ...expenses]);
    setShowAddExpense(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const addCategory = (name: string, icon: string, color: string) => {
    const newCat: Category = {
      id: crypto.randomUUID(),
      name,
      icon,
      color
    };
    setCategories([...categories, newCat]);
    setShowAddCategory(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-32 font-sans">
      {/* Header */}
      <header className="mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-slate-800 mb-2"
        >
          Presupuesto Pastel
        </motion.h1>
        <p className="text-slate-500 text-sm italic">Gestiona tus ahorros con suavidad</p>
      </header>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-white/40 backdrop-blur-sm rounded-2xl mb-8 border border-white/50">
        <button 
          onClick={() => setActiveTab(BudgetType.MONTHLY)}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === BudgetType.MONTHLY ? 'bg-white shadow-sm text-pink-500' : 'text-slate-500'}`}
        >
          Mensual
        </button>
        <button 
          onClick={() => setActiveTab(BudgetType.WEEKLY)}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === BudgetType.WEEKLY ? 'bg-white shadow-sm text-blue-500' : 'text-slate-500'}`}
        >
          Semanal
        </button>
      </div>

      {/* Budget Card */}
      <motion.div 
        layout
        className="pastel-card p-6 mb-8 relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 ${activeTab === BudgetType.MONTHLY ? 'bg-pink-400' : 'bg-blue-400'}`} />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Presupuesto {activeTab}</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">€{currentLimit.toLocaleString('es-ES')}</span>
              <button 
                onClick={() => setShowEditLimit(true)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Settings2 size={16} />
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Restante</p>
            <p className={`text-xl font-bold ${remaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              €{remaining.toLocaleString('es-ES')}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentSpent}%` }}
              className={`h-full rounded-full ${remaining < 0 ? 'bg-rose-300' : activeTab === BudgetType.MONTHLY ? 'bg-pink-300' : 'bg-blue-300'}`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase">
            <span>Gastado: €{totalSpent.toLocaleString('es-ES')}</span>
            <span>{percentSpent.toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="pastel-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500">
            <TrendingDown size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold">Gastos</p>
            <p className="font-bold text-slate-700">{filteredExpenses.length}</p>
          </div>
        </div>
        <div className="pastel-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500">
            <PieChart size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold">Categorías</p>
            <p className="font-bold text-slate-700">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-700">Gastos Recientes</h2>
          <button 
            onClick={() => setShowAddCategory(true)}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <PlusCircle size={14} /> Nueva Categoría
          </button>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredExpenses.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-slate-400 italic text-sm"
              >
                No hay gastos registrados todavía.
              </motion.div>
            ) : (
              filteredExpenses.map((expense) => {
                const category = categories.find(c => c.id === expense.categoryId) || DEFAULT_CATEGORIES[5];
                return (
                  <motion.div
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="pastel-card p-4 flex items-center gap-4 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${category.color} flex items-center justify-center text-slate-700`}>
                      <IconRenderer name={category.icon} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-700">{expense.description || category.name}</p>
                      <p className="text-xs text-slate-400">{new Date(expense.date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="font-bold text-slate-700">-€{expense.amount.toLocaleString('es-ES')}</p>
                      <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddExpense(true)}
          className="btn-pastel bg-slate-800 text-white flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          <Plus size={20} /> Añadir Gasto
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddExpense && (
          <Modal onClose={() => setShowAddExpense(false)} title="Añadir Gasto">
            <ExpenseForm 
              categories={categories} 
              onSubmit={addExpense} 
              onClose={() => setShowAddExpense(false)} 
            />
          </Modal>
        )}

        {showAddCategory && (
          <Modal onClose={() => setShowAddCategory(false)} title="Nueva Categoría">
            <CategoryForm 
              onSubmit={addCategory} 
              onClose={() => setShowAddCategory(false)} 
            />
          </Modal>
        )}

        {showEditLimit && (
          <Modal onClose={() => setShowEditLimit(false)} title={`Editar Presupuesto ${activeTab}`}>
            <BudgetLimitForm 
              currentLimit={currentLimit}
              onSubmit={(num: number) => {
                activeTab === BudgetType.MONTHLY ? setMonthlyLimit(num) : setWeeklyLimit(num);
                setShowEditLimit(false);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function Modal({ children, onClose, title }: { children: React.ReactNode, onClose: () => void, title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function ExpenseForm({ categories, onSubmit, onClose }: { categories: Category[], onSubmit: any, onClose: any }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (amount && categoryId) {
        onSubmit(parseFloat(amount), categoryId, description);
      }
    }} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Importe (€)</label>
        <input 
          type="number" 
          step="0.01"
          required
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="input-pastel w-full text-2xl font-bold"
        />
      </div>
      
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descripción</label>
        <input 
          type="text" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej. Compra semanal"
          className="input-pastel w-full"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categoría</label>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${categoryId === cat.id ? 'border-pink-300 bg-pink-50' : 'border-transparent bg-slate-50'}`}
            >
              <div className={`w-8 h-8 rounded-xl ${cat.color} flex items-center justify-center text-slate-700`}>
                <IconRenderer name={cat.icon} />
              </div>
              <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-pastel bg-pink-400 text-white w-full shadow-lg shadow-pink-100">
        Guardar Gasto
      </button>
    </form>
  );
}

function BudgetLimitForm({ currentLimit, onSubmit }: { currentLimit: number, onSubmit: (num: number) => void }) {
  const [limit, setLimit] = useState(currentLimit.toString());

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const num = parseFloat(limit);
      if (!isNaN(num)) {
        onSubmit(num);
      }
    }} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nuevo Presupuesto (€)</label>
        <input 
          type="number" 
          step="0.01"
          required
          autoFocus
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="0.00"
          className="input-pastel w-full text-2xl font-bold"
        />
      </div>
      
      <button type="submit" className="btn-pastel bg-slate-800 text-white w-full shadow-lg shadow-slate-200">
        Actualizar Presupuesto
      </button>
    </form>
  );
}

function CategoryForm({ onSubmit, onClose }: { onSubmit: any, onClose: any }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('ShoppingBag');
  const [color, setColor] = useState(PASTEL_COLORS[0]);

  const icons = ['ShoppingBag', 'Coffee', 'Music', 'Book', 'Smartphone', 'Gift', 'Heart', 'Utensils', 'Car', 'Home'];

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (name) {
        onSubmit(name, icon, color);
      }
    }} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre de Categoría</label>
        <input 
          type="text" 
          required
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Suscripciones"
          className="input-pastel w-full"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Icono</label>
        <div className="flex flex-wrap gap-2">
          {icons.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${icon === i ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              <IconRenderer name={i} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Color Pastel</label>
        <div className="flex flex-wrap gap-2">
          {PASTEL_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-xl ${c} border-2 transition-all ${color === c ? 'border-slate-800' : 'border-transparent'}`}
            />
          ))}
        </div>
      </div>

      <button type="submit" className="btn-pastel bg-blue-400 text-white w-full shadow-lg shadow-blue-100">
        Crear Categoría
      </button>
    </form>
  );
}
