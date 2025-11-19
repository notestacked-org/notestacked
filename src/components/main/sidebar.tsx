"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { FiPlus, FiChevronDown } from "react-icons/fi"
import { MdGroups } from "react-icons/md"
import { HiOutlineClock } from "react-icons/hi"
import { FileText as LuFileText } from "lucide-react"
import { WorkspaceDialog } from "../dialogs/workspace-dialog"
import { ManageMembersDialog } from "../dialogs/manage-members-dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useAppStore, workspace, workspaceMember } from "@/lib/store"
import { useWorkspaces } from "@/features/workspace/api/getWorkspaces"
import { useWorkspaceMembers } from "@/features/workspace/api/getWorkspaceMembers"
import { useRecentNotes } from "@/features/notes/api/recentNotes"
import { set } from "zod"
import { Role } from "@prisma/client"


export function Sidebar() {
  
  const { currentWorkspace,
     setCurrentWorkspace,
     setWorkspaceMembers,
     workspaceMembers,
     workspaces,
     setWorkspaces,
     setRecentNotes,
     recentNotes
    } = useAppStore();
  const { data, isSuccess } = useWorkspaces();
  if (data?.success && isSuccess) {
    setCurrentWorkspace(data.workspaces[0]);
    setWorkspaces(data.workspaces)
  }
  const { data: membersData, isSuccess: membersSuccess } = useWorkspaceMembers({ workspaceId: currentWorkspace?.workspaceId || "" }, !!currentWorkspace);
  if (membersSuccess && membersData.success) {
    setWorkspaceMembers(membersData.workspaceMembers);
  }
  const {data:recentNotesData,isSuccess:recentNotesSuccess} = useRecentNotes();
  if(recentNotesSuccess && recentNotesData.success){
    setRecentNotes(recentNotesData.recentNotes.map(note=>({
      id:note.id,
      noteId:note.noteId,
      userId:note.userId,
      lastOpened:new Date(note.lastOpened),
      title:note.note.title,
    })));

  }

  const [showWorkspaceDialog, setShowWorkspaceDialog] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)


  return (
    <>
      <div className="w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground">
              📝
            </div>
            <span>NotesTacked</span>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="p-4 border-b border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 border-sidebar-border"
              >
                <span className="truncate">{currentWorkspace?.name}</span>
                <FiChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Your Workspaces</div>
              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.workspaceId}
                  onClick={() => setCurrentWorkspace(workspace)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col gap-1 w-full">
                    <span className={currentWorkspace?.workspaceId === workspace.workspaceId ? "font-semibold" : ""}>
                      {workspace.name}
                    </span>
                    {/* <span className="text-xs text-muted-foreground">{workspace.members.length} members</span> */}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowWorkspaceDialog(true)}
                className="cursor-pointer text-sidebar-primary gap-2"
              >
                <FiPlus className="h-4 w-4" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Members Section */}
          <div className="flex-1 flex flex-col px-4 py-3 overflow-hidden">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <MdGroups className="h-4 w-4" />
              Members
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {workspaceMembers?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 hover:bg-sidebar-accent rounded group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="h-4 w-5 rounded-full flex justify-center items-center">   
                        <img className="h-full w-full object-fill bg-cover" src={member.profilePic || "https://placehold.co/600x400"} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <MemberContextMenu member={member} workspace={currentWorkspace} />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Recent Notes Section */}
          <div className="flex-1 flex flex-col px-4 py-3 overflow-hidden border-b border-sidebar-border">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <HiOutlineClock className="h-4 w-4" />
              Recent Notes
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {recentNotes?.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded cursor-pointer transition-colors"
                  >
                    <LuFileText className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{note.title}</div>
                      <div className="text-xs text-muted-foreground">{note.lastOpened.getDate()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <WorkspaceDialog open={showWorkspaceDialog} onOpenChange={setShowWorkspaceDialog} />
      <ManageMembersDialog open={showMembersDialog} onOpenChange={setShowMembersDialog} />
    </>
  )
}

function MemberContextMenu({ member, workspace }: { member: workspaceMember; workspace: workspace | null }) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [newRole, setNewRole] = useState(member.role)
    const currentWorkspaceId= workspace?.workspaceId;
  const removeMember=(workspaceId:string,memberId:string)=>{

  }
  const updateMemberRole = (workspaceId:string,memberId:string,role:Role)=>{

  }
  const promoteToOwner=(workspaceId:string | null,memberId:string)=>{

  }

  const handleRemoveMember = () => {
    removeMember(currentWorkspaceId!, member.id)
    setShowRemoveConfirm(false)
  }

  const handleRoleChange = () => {
    updateMemberRole(currentWorkspaceId!, member.id, newRole as Role)
    setShowRoleDialog(false)
  }

  const handlePromoteToOwner = () => {
    promoteToOwner(currentWorkspaceId!, member.id)
    setShowPromoteConfirm(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <span className="text-lg">⋯</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowRoleDialog(true)} className="cursor-pointer">
            Change Role
          </DropdownMenuItem>
          {member.role==="ADMIN" && (<DropdownMenuItem onClick={() => setShowPromoteConfirm(true)} className="cursor-pointer">
            Promote to Owner
          </DropdownMenuItem>)}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowRemoveConfirm(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {member.name} from the workspace? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPromoteConfirm} onOpenChange={setShowPromoteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote to Owner?</AlertDialogTitle>
            <AlertDialogDescription>
              Promote {member.name} to Owner? The current owner will be demoted to Admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePromoteToOwner} className="bg-blue-600 hover:bg-blue-700">
              Promote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Change the role for {member.name}</DialogDescription>
          </DialogHeader>

          <Select value={newRole} onValueChange={()=>setNewRole(newRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer - Can only view</SelectItem>
              <SelectItem value="editor">Editor - Can edit notes</SelectItem>
              <SelectItem value="admin">Admin - Full access</SelectItem>
              <SelectItem value="owner">Owner - Workspace owner</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
