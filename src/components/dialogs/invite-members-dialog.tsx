"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface InvitedUser {
  email: string
  role: string
}

interface InviteMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMembersDialog({ open, onOpenChange }: InviteMembersDialogProps) {
  const { currentWorkspaceId, addMember, addNotification } = useAppStore()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("editor")
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([])

  const handleAddUser = () => {
    if (email.trim() && !invitedUsers.find((u) => u.email === email)) {
      setInvitedUsers([...invitedUsers, { email: email.trim(), role }])
      setEmail("")
      setRole("editor")
    }
  }

  const handleRemoveUser = (emailToRemove: string) => {
    setInvitedUsers(invitedUsers.filter((u) => u.email !== emailToRemove))
  }

  const handleChangeRole = (email: string, newRole: string) => {
    setInvitedUsers(invitedUsers.map((u) => (u.email === email ? { ...u, role: newRole } : u)))
  }

  const handleInvite = () => {
    if (invitedUsers.length > 0) {
      invitedUsers.forEach((user) => {
        addMember(currentWorkspaceId, {
          id: `mem-${Date.now()}-${Math.random()}`,
          name: user.email.split("@")[0],
          email: user.email,
          role: user.role as any,
          avatar: "👤",
          joinedDate: new Date().toISOString().split("T")[0],
        })

        addNotification({
          type: "invitation",
          title: "Workspace Invitation",
          description: `You've been invited to join the workspace`,
          workspaceId: currentWorkspaceId,
          timestamp: new Date().toISOString(),
          read: false,
        })
      })
      setInvitedUsers([])
      onOpenChange(false)
    }
  }

  const isFormValid = email.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>Add team members to your workspace. Select a role for each member.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email" className="text-xs">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && isFormValid && handleAddUser()}
              />
            </div>
            <div className="w-32 space-y-2">
              <Label htmlFor="role" className="text-xs">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddUser} disabled={!isFormValid} className="self-end">
              Add
            </Button>
          </div>

          {invitedUsers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Pending Invites ({invitedUsers.length})</Label>
              <ScrollArea className="min-h-80 max-h-96 border border-border rounded-lg p-3 bg-muted/30">
                <div className="space-y-2 pr-4">
                  {invitedUsers.map((user) => (
                    <div
                      key={user.email}
                      className="flex items-center justify-between p-2 bg-background rounded border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Select value={user.role} onValueChange={(newRole) => handleChangeRole(user.email, newRole)}>
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleRemoveUser(user.email)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={invitedUsers.length === 0}>
            Send{" "}
            {invitedUsers.length > 0 ? `${invitedUsers.length} Invite${invitedUsers.length > 1 ? "s" : ""}` : "Invites"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
