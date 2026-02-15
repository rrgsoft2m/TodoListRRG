'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const login = useAuthStore((state: any) => state.login)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            await login({ email, password })
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Card className="w-[350px] shadow-lg backdrop-blur-sm bg-opacity-90">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Vibe ToDo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    placeholder="Password"
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
                            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity">
                                Kirish / Login
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center text-sm text-gray-500">
                        Hisobingiz yo'qmi? &nbsp; <Link href="/register" className="text-primary hover:underline">Ro'yxatdan o'tish</Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
