"use client"

import { generateSlug } from "@/api/workflows/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { workflowType } from "@/lib/db/schema"
import { Building2, ChevronRight, Plus } from "lucide-react"
import {
  LayoutDashboard,
  Settings,
  Users,
  HelpCircle,
  Folder,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"

interface Props {
  orgNav: workflowType[]
  onCreateWorkflow: (name: string) => Promise<void>
}
export const WorkFlowNav = ({ orgNav, onCreateWorkflow }: Props) => {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleCreateWorkflow = () => {
    startTransition(async () => {
      await onCreateWorkflow(generateSlug())
    })
  }
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible asChild defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Workflows"}>
                {<Building2 />}
                <span>{"Workflows"}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <SidebarMenuSub>
                <>
                  {orgNav.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={
                          pathname === `/dashboard/workflows/${subItem.id}`
                        }
                      >
                        <Link href={`/dashboard/workflows/${subItem.id}`}>
                          <span>{subItem.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  <Separator />
                  <Button
                    className="flex items-center justify-between"
                    variant={"outline"}
                    onClick={handleCreateWorkflow}
                    disabled={isPending}
                  >
                    <span>Create Workflow</span>
                    <Plus />
                  </Button>
                </>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
