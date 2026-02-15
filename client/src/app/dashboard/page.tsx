'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useTodoStore } from '@/store/todoStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, CheckCircle, LogOut, Loader2, Search } from 'lucide-react'

export default function Dashboard() {
    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuthStore((state: any) => state)
    const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo, isLoading } = useTodoStore((state: any) => state)
    const [newTodo, setNewTodo] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        } else {
            fetchTodos()
        }
    }, [isAuthenticated, router, fetchTodos])

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo.trim()) return
        await addTodo({ title: newTodo })
        setNewTodo('')
    }

    const filteredTodos = todos.filter((todo: any) => {
        // Filter by status
        if (filter === 'completed' && !todo.completed) return false
        if (filter === 'pending' && todo.completed) return false

        // Filter by search query
        if (searchQuery) {
            return todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        }

        return true
    })

    // Calculate stats
    const total = todos.length
    const completed = todos.filter((t: any) => t.completed).length
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

    if (!user) return null

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Salom, {user.name} 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Bugungi rejalaringiz qanday?</p>
                    </div>
                    <Button variant="ghost" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="w-5 h-5 mr-2" /> Chiqish
                    </Button>
                </header>

                {/* Progress Bar */}
                <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CheckCircle className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8 relative z-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">Sizning natijangiz</h2>
                                <p className="opacity-90">{completed} ta vazifa bajarildi / {total} jami</p>
                            </div>
                            <span className="text-4xl font-bold">{progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                            <div
                                className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Add Todo */}
                <form onSubmit={handleAddTodo} className="flex gap-4">
                    <Input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Yangi vazifa qo'shish..."
                        className="h-12 text-lg shadow-sm"
                    />
                    <Button type="submit" size="lg" className="px-8 shadow-blue-200 shadow-lg">
                        <Plus className="w-6 h-6" />
                    </Button>
                </form>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Qidirish..."
                            className="pl-10 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        {['all', 'pending', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {f === 'all' && 'Barchasi'}
                                {f === 'pending' && 'Bajarilmagan'}
                                {f === 'completed' && 'Bajarilgan'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Todo List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredTodos.map((todo: any) => (
                                <motion.div
                                    key={todo.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                >
                                    <Card className={`group hover:shadow-md transition-shadow ${todo.completed ? 'bg-gray-50/50' : 'bg-white'}`}>
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <button
                                                onClick={() => toggleTodo(todo.id, !todo.completed)}
                                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300 hover:border-primary'
                                                    }`}
                                            >
                                                {todo.completed && <CheckCircle className="w-4 h-4" />}
                                            </button>

                                            <div className="flex-grow">
                                                <p className={`text-lg transition-all ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                                                    }`}>
                                                    {todo.title}
                                                </p>
                                                {todo.dueDate && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(todo.dueDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {!isLoading && filteredTodos.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <p className="text-gray-400 text-lg">Hozircha vazifalar yo'q 🎉</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
