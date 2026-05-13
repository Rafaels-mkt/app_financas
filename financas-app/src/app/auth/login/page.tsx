"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Loader2, AlertTriangle, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [notConfirmed, setNotConfirmed] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendDone, setResendDone] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setNotConfirmed(false)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Supabase retorna "Email not confirmed" quando o email ainda não foi confirmado
      if (error.message.toLowerCase().includes("email not confirmed") ||
          error.message.toLowerCase().includes("not confirmed")) {
        setNotConfirmed(true)
      } else if (error.message.toLowerCase().includes("invalid login credentials") ||
                 error.message.toLowerCase().includes("invalid")) {
        setError("Email ou senha incorretos. Verifique seus dados.")
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  async function handleResendEmail() {
    setResendLoading(true)
    const supabase = createClient()
    await supabase.auth.resend({ type: "signup", email })
    setResendLoading(false)
    setResendDone(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary rounded-xl p-2">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Rotina Financeira do Rafa</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Entre com sua conta para continuar</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {notConfirmed && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                        Email não confirmado
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                        Você precisa confirmar seu email antes de entrar. Verifique sua caixa de entrada e a pasta de <strong>spam</strong>.
                      </p>
                    </div>
                  </div>
                  {resendDone ? (
                    <p className="text-sm text-emerald-600 font-medium">
                      ✓ Email de confirmação reenviado! Verifique sua caixa de entrada.
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={handleResendEmail}
                      disabled={resendLoading}
                    >
                      {resendLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                      Reenviar email de confirmação
                    </Button>
                  )}
                </div>
              )}

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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Entrar
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Não tem uma conta?{" "}
                <Link href="/auth/register" className="text-primary font-medium hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
