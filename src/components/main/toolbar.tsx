"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FiMoreVertical } from "react-icons/fi"
import { MdOutlinePersonAdd } from "react-icons/md"
import { LuPlus } from "react-icons/lu"
import { InviteMembersDialog } from "../dialogs/invite-members-dialog"
import { SettingsDialog } from "../dialogs/settings-dialog"
import { CreateNoteDialog } from "../dialogs/create-note-dialog"

interface ToolbarProps {
  workspace: string
}

export function Toolbar({ workspace }: ToolbarProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-background p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button className="gap-2" size="sm" onClick={() => setShowCreateNoteDialog(true)}>
            <LuPlus className="h-4 w-4" />
            Create Note
          </Button>
          <Button className="gap-2" size="sm" onClick={() => setShowInviteDialog(true)}>
            <MdOutlinePersonAdd className="h-4 w-4" />
            Invite Members
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettingsDialog(true)}>
            <FiMoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CreateNoteDialog open={showCreateNoteDialog} onOpenChange={setShowCreateNoteDialog} />
      <InviteMembersDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} />
      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} workspace={workspace} />
    </>
  )
}
