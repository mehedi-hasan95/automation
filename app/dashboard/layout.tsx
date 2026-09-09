import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true} className="h-svh">
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-0 overflow-hidden border shadow-none!">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
