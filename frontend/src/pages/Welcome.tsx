import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden bg-pattern">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center space-y-8 p-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-2xl bg-black border-2 border-primary/30 shadow-[0_0_30px_rgba(46,204,113,0.4)]">
          <img 
            src="/panda.jpg" 
            alt="Panda Logo" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70">
            Welcome to <span className="text-primary">PandaBudget</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Take control of your finances with a simple, modern, and smart personal budget tracker.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/dashboard")} 
          size="lg" 
          className="mt-8 text-base px-6 py-4 h-auto rounded-full gap-3 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
        >
          Enter Dashboard
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
