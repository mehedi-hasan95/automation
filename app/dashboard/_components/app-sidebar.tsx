import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { OrganizationSwitcher } from "@clerk/nextjs"

import { AppSidebarFooter } from "./sidebar-footer"
import { WorkFlowNav } from "./workflow-nav"
import { auth } from "@clerk/nextjs/server"
import { getWorkflow } from "@/api/workflows"
import { createWorkflowAction } from "@/api/workflows/action"

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { orgId } = await auth()
  const data = orgId ? await getWorkflow(orgId) : []
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard"
          afterLeaveOrganizationUrl="/"
          hidePersonal
          appearance={{
            elements: {
              rootBox: "min-w-0 group-data-[collapsible=icon]:hidden!",
              organizationSwitcherTrigger: "w-full justify-between",
            },
          }}
        />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <WorkFlowNav orgNav={data} onCreateWorkflow={createWorkflowAction} />
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:items-center">
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  )
}
