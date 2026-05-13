import Link from "next/link"
import { TrendingUp, BarChart3, Shield, Smartphone, Download, Tag, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const features = [
  {
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-600",
    title: "Controle em tempo real",
    description: "Acompanhe receitas e despesas no momento em que acontecem, com saldo sempre atualizado.",
  },
  {
    icon: BarChart3,
    color: "bg-purple-100 text-purple-600",
    title: "Gráficos por categoria",
    description: "Visualize onde seu dinheiro vai com gráficos de pizza por categoria.",
  },
  {
    icon: Shield,
    color: "bg-green-100 text-green-600",
    title: "Seus dados protegidos",
    description: "Autenticação segura e dados isolados — apenas você acessa seus dados.",
  },
  {
    icon: Download,
    color: "bg-orange-100 text-orange-600",
    title: "Exportar CSV",
    description: "Exporte suas transações filtradas para Excel ou Google Sheets a qualquer hora.",
  },
  {
    icon: Smartphone,
    color: "bg-pink-100 text-pink-600",
    title: "Mobile-first",
    description: "Interface responsiva que funciona perfeitamente no celular e no desktop.",
  },
  {
    icon: Tag,
    color: "bg-teal-100 text-teal-600",
    title: "Categorias prontas",
    description: "9 categorias pré-definidas para classificar receitas e despesas rapidamente.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Rotina Financeira do Rafa</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Começar grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-sm mb-8">
          <CheckCircle className="h-4 w-4 text-green-500" />
          100% gratuito e sem anúncios
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground max-w-3xl leading-tight mb-6">
          Controle suas finanças{" "}
          <span className="text-primary">com clareza</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          Registre receitas e despesas, acompanhe seu saldo em tempo real e visualize gráficos por
          categoria. Simples, rápido e seguro.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/auth/register">
            <Button size="lg" className="px-8">
              Criar conta grátis <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="px-8">
              Já tenho conta
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Tudo que você precisa</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Uma ferramenta completa para organizar sua vida financeira de forma visual e intuitiva.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-card rounded-2xl p-6 shadow-sm border">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-card-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-primary rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Comece a organizar suas finanças hoje</h2>
          <p className="mb-8 opacity-80">
            Crie sua conta em segundos. Sem cartão de crédito. Sem complicação.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="px-8 font-semibold">
              Criar conta grátis <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Rotina Financeira do Rafa. Feito com Next.js + Supabase.
      </footer>
    </div>
  )
}
