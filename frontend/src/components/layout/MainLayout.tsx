import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background bg-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/95 to-background z-0 pointer-events-none" />
      <div className="relative z-10 flex w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="container mx-auto p-4 md:p-6 max-w-[1600px]">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
