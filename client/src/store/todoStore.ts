import { create } from 'zustand';
import axios from '@/services/api';

interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
}

interface TodoState {
    todos: Todo[];
    isLoading: boolean;
    fetchTodos: () => Promise<void>;
    addTodo: (todoData: any) => Promise<void>;
    toggleTodo: (id: number, completed: boolean) => Promise<void>;
    deleteTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
    todos: [],
    isLoading: false,

    fetchTodos: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axios.get('/todos');
            set({ todos: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    addTodo: async (todoData) => {
        try {
            const { data } = await axios.post('/todos', todoData);
            set({ todos: [...get().todos, data] });
        } catch (error) {
            console.error(error);
        }
    },

    toggleTodo: async (id, completed) => {
        try {
            // Optimistic update
            const updatedTodos = get().todos.map((t) =>
                t.id === id ? { ...t, completed } : t
            );
            set({ todos: updatedTodos });

            await axios.put(`/todos/${id}`, { completed });
        } catch (error) {
            // Revert on error could be implemented here
            console.error(error);
            get().fetchTodos(); // Refetch to sync
        }
    },

    deleteTodo: async (id) => {
        try {
            const updatedTodos = get().todos.filter((t) => t.id !== id);
            set({ todos: updatedTodos });
            await axios.delete(`/todos/${id}`);
        } catch (error) {
            console.error(error);
            get().fetchTodos();
        }
    },
}));
