'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const register = useAuthStore((state: any) => state.register)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        try {
            await register({ name, email, password })
            setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Tizimga yo'naltirilmoqda...")
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (error: any) {
            setError(error.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-[350px] shadow-lg backdrop-blur-sm bg-opacity-90">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent">
                            Ro'yxatdan o'tish
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Ism / Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Parol / Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/10 border border-green-200 rounded-md">
                                    {success}
                                </div>
                            )}
                            <Button type="submit" variant="secondary" className="w-full bg-gradient-to-r from-secondary to-green-500 hover:opacity-90">
                                A'zo bo'lish
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center text-sm text-gray-500">
                        Allaqachon a'zomisiz? &nbsp; <Link href="/login" className="text-secondary hover:underline">Kirish</Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
