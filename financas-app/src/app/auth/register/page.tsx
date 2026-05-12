"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Loader2, Mail, AlertTriangle, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)

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

    setEmailSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary rounded-xl p-2">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">FinançasPessoais</span>
          </Link>
        </div>

        {emailSent ? (
          /* ── Tela de confirmação de email ── */
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-4">
                  <Mail className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Verifique seu email!</CardTitle>
              <CardDescription className="text-base mt-1">
                Enviamos um link de confirmação para
              </CardDescription>
              <p className="font-semibold text-foreground text-sm mt-1">{email}</p>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
                <p className="text-sm text-foreground font-medium">O que fazer agora:</p>
                <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                  <li>Abra sua caixa de entrada do email acima</li>
                  <li>Procure um email de <span className="font-medium text-foreground">noreply@mail.app.supabase.io</span></li>
                  <li>Clique no botão <span className="font-medium text-foreground">"Confirmar email"</span></li>
                  <li>Você será redirecionado para o app automaticamente</li>
                </ol>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    Não encontrou o email?
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-500 mt-0.5">
                    Verifique a pasta de <span className="font-semibold">spam</span> ou <span className="font-semibold">lixo eletrônico</span>. O email pode demorar até 2 minutos para chegar.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { setEmailSent(false) }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Usar outro email
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Já confirmou?{" "}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                  Entrar agora
                </Link>
              </p>
            </CardFooter>
          </Card>
        ) : (
          /* ── Formulário de cadastro ── */
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
                <Button type="submit" className="w-full" disabled={loading}>
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
        )}
      </div>
    </div>
  )
}
