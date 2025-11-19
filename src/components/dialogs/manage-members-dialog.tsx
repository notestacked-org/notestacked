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
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { MoreVertical, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAppStore, workspaceMember } from "@/lib/store"
import { Role } from "@prisma/client"

interface ManageMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageMembersDialog({ open, onOpenChange }: ManageMembersDialogProps) {
  const { currentWorkspace, workspaceMembers, setWorkspaceMembers } = useAppStore()
  const workspace = currentWorkspace
  const currentWorkspaceId = workspace?.workspaceId || ''
  
  // Fix: Correct initialization from workspaceMembers
  const [members, setMembers] = useState<workspaceMember[]>(workspaceMembers || [])

  const [selectedMember, setSelectedMember] = useState<workspaceMember | null>(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false)
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false)
  const [newRole, setNewRole] = useState<Role>(Role.VIEWER)

  // Mock functions - replace with actual API calls
  const updateMemberRole = async (workspaceId: string, memberId: string, role: Role) => {
    // TODO: Implement API call
    console.log('Updating role:', { workspaceId, memberId, role })
  }

  const promoteToOwner = async (workspaceId: string, memberId: string) => {
    // TODO: Implement API call
    console.log('Promoting to owner:', { workspaceId, memberId })
  }

  const removeMember = async (workspaceId: string, memberId: string) => {
    // TODO: Implement API call
    console.log('Removing member:', { workspaceId, memberId })
  }

  const handleRoleChange = (memberId: string, role: Role) => {
    updateMemberRole(currentWorkspaceId, memberId, role)
    const updatedMembers = members.map((m) => (m.id === memberId ? { ...m, role } : m))
    setMembers(updatedMembers)
    setWorkspaceMembers(updatedMembers)
  }

  const handlePromoteToOwner = (member: workspaceMember) => {
    promoteToOwner(currentWorkspaceId, member.id)
    const updatedMembers = members.map((m) =>
      m.role === Role.OWNER && m.id !== member.id
        ? { ...m, role: Role.ADMIN }
        : m.id === member.id
          ? { ...m, role: Role.OWNER }
          : m,
    )
    setMembers(updatedMembers)
    setWorkspaceMembers(updatedMembers)
  }

  const confirmPromoteToOwner = () => {
    if (selectedMember) {
      handlePromoteToOwner(selectedMember)
      setShowPromoteConfirm(false)
      setSelectedMember(null)
    }
  }

  const handleRemoveMember = (member: workspaceMember) => {
    removeMember(currentWorkspaceId, member.id)
    const updatedMembers = members.filter((m) => m.id !== member.id)
    setMembers(updatedMembers)
    setWorkspaceMembers(updatedMembers)
  }

  const confirmRemoveMember = () => {
    if (selectedMember) {
      handleRemoveMember(selectedMember)
      setShowRemoveConfirm(false)
      setSelectedMember(null)
    }
  }

  const handleOpenRoleChangeDialog = (member: workspaceMember) => {
    setSelectedMember(member)
    setNewRole(member.role)
    setShowRoleChangeDialog(true)
  }

  const confirmRoleChange = () => {
    if (selectedMember && newRole !== selectedMember.role) {
      handleRoleChange(selectedMember.id, newRole)
    }
    setShowRoleChangeDialog(false)
    setSelectedMember(null)
  }

  // Helper function to get display name for role
  const getRoleDisplay = (role: Role) => {
    return role.charAt(0) + role.slice(1).toLowerCase()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Members</DialogTitle>
            <DialogDescription>View and manage workspace members, change roles, or remove members.</DialogDescription>
          </DialogHeader>

          <div className="max-h-[500px] overflow-y-auto">
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl flex-shrink-0">
                      {member.profilePic || '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{member.name || 'Unknown User'}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-xs font-semibold px-2 py-1 rounded bg-muted capitalize">
                      {getRoleDisplay(member.role)}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenRoleChangeDialog(member)}
                          className="cursor-pointer"
                          disabled={member.role === Role.OWNER}
                        >
                          Change Role
                        </DropdownMenuItem>
                        {member.role !== Role.OWNER && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedMember(member)
                                setShowPromoteConfirm(true)
                              }} 
                              className="cursor-pointer"
                            >
                              Promote to Owner
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setShowRemoveConfirm(true)
                          }}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleChangeDialog} onOpenChange={setShowRoleChangeDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>Change the role for {selectedMember?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Select value={newRole} onValueChange={(value) => setNewRole(value as Role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.VIEWER}>Viewer - Can only view</SelectItem>
                <SelectItem value={Role.EDITOR}>Editor - Can edit notes</SelectItem>
                <SelectItem value={Role.ADMIN}>Admin - Full access</SelectItem>
                <SelectItem value={Role.OWNER}>Owner - Workspace owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleChangeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRoleChange}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from the workspace? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPromoteConfirm} onOpenChange={setShowPromoteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote to Owner?</AlertDialogTitle>
            <AlertDialogDescription>
              Promote {selectedMember?.name} to Owner? The current owner will be demoted to Admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPromoteToOwner} className="bg-blue-600 hover:bg-blue-700">
              Promote to Owner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}