import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full flex-col md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className="mx-auto max-w-[1480px] px-4 py-6 sm:px-7 md:px-10 md:py-9">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
