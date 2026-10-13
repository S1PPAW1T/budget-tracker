import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight, TrendingUp, Layers3, MoveDownLeft } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-9 sm:py-8">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/panda.jpg" alt="" className="h-10 w-10 rounded-xl object-cover" />
          <span className="font-['Manrope'] text-lg font-extrabold tracking-tight">PandaBudget</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="eyebrow hidden sm:block">Personal finance, made clear</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] items-center gap-12 py-16 md:min-h-[calc(100vh-96px)] md:grid-cols-[1.05fr_.95fr] md:gap-16 md:py-8">
        <div className="max-w-[650px]">
          <p className="eyebrow mb-5">A clearer way to manage money</p>
          <h1 className="font-['Manrope'] text-[clamp(3.3rem,7vw,6.6rem)] font-extrabold leading-[1.04] tracking-[-.075em]">
            Make room for <span className="text-primary">what matters.</span>
          </h1>
          <p className="mt-7 max-w-[470px] text-lg leading-relaxed text-muted-foreground">
            Track every transaction, give each category a purpose, and know what you can spend at a glance.
          </p>
          <Button onClick={() => navigate("/dashboard")} size="lg" className="mt-9 gap-3 px-6">
            Open dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-[#15392d] p-8 text-white sm:p-10 md:min-h-[540px] md:p-12">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/15 shadow-[0_0_0_55px_rgba(255,255,255,.035),0_0_0_110px_rgba(255,255,255,.02)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-[.17em] text-white/80">Inside PandaBudget</p>
              <h2 className="mt-10 max-w-[360px] font-['Manrope'] text-4xl font-bold leading-tight tracking-[-.055em] sm:text-5xl">Every baht has a place.</h2>
            </div>
            <div className="mt-16 space-y-3">
              {[
                { icon: MoveDownLeft, title: "Record income", detail: "See what comes in." },
                { icon: Layers3, title: "Fund categories", detail: "Know what is available." },
                { icon: TrendingUp, title: "Read the pattern", detail: "Spot changes over time." },
              ].map(item => (
                <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5">
                  <span className="rounded-xl bg-white/10 p-2.5"><item.icon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-xs text-white/80">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
