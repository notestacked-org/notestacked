"use client"
import { Toolbar } from "./toolbar"
import { NotesGrid } from "./notes-grid"
import { ProfileMenu } from "./profile-menu"
import { NotificationsPanel } from "./notifications-panel"
import { useState } from "react"
import { HiOutlineInformationCircle } from "react-icons/hi"
import { useAppStore } from "@/lib/store"

interface MainContentProps {
  workspace: string
  theme: "light" | "dark"
  onThemeToggle: () => void
}

export function MainContent({ workspace, theme, onThemeToggle }: MainContentProps) {
  const { currentWorkspace, workspaces } = useAppStore()
  const [expandedWorkspace, setExpandedWorkspace] = useState(false)

  const currentWs = currentWorkspace;

  const workspaceInfo = {
    owner: currentWs?.ownerId ? `User ${currentWs.ownerId}` : "Unknown",
    createdDate: currentWs?.createdDate ? new Date(currentWs.createdDate).toLocaleDateString() : "Unknown",
    description: currentWs?.description || "No description provided",
  }

  const handleLogout = () => {
    console.log("User logged out")
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{workspace}</h1>
            <button
              onClick={() => setExpandedWorkspace(!expandedWorkspace)}
              className="p-1 hover:bg-background-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
              title="Workspace details"
            >
              <HiOutlineInformationCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsPanel />
            <ProfileMenu theme={theme} onThemeToggle={onThemeToggle} onLogout={handleLogout} />
          </div>
        </div>

        {expandedWorkspace && (
          <div className="mt-3 space-y-2 text-sm text-muted-foreground animate-in fade-in-50 duration-200">
            <div>{workspaceInfo.description}</div>
            <div className="flex items-center gap-4 pt-1">
              <span>
                Owner: <span className="font-medium text-foreground">{workspaceInfo.owner}</span>
              </span>
              <span>
                Created: <span className="font-medium text-foreground">{workspaceInfo.createdDate}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar workspace={workspace} />

      {/* Notes Grid */}
      <NotesGrid workspace={workspace} />
    </div>
  )
}
