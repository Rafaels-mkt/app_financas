"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push("/dashboard"), 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-xl p-2">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">FinançasFácil</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crie sua conta</CardTitle>
            <CardDescription>Comece a controlar suas finanças hoje</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm rounded-md p-3">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-success/10 text-success text-sm rounded-md p-3">
                  Conta criada! Redirecionando...
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading || success}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar conta
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                  Entre aqui
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
