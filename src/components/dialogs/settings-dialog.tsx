"use client"

import { ManageMembersDialog } from "./manage-members-dialog"
import { WorkspaceDialog } from "./workspace-dialog"

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
import { Separator } from "@/components/ui/separator"
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

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: string
}

export function SettingsDialog({ open, onOpenChange, workspace }: SettingsDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [showEditWorkspace, setShowEditWorkspace] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace Settings</DialogTitle>
            <DialogDescription>Manage settings for the {workspace} workspace</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">General</h3>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowEditWorkspace(true)}
              >
                Edit Workspace Details
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowManageMembers(true)}
              >
                Manage Members
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Workspace</h3>
              {!showLeaveConfirm ? (
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
                  onClick={() => setShowLeaveConfirm(true)}
                >
                  Leave Workspace
                </Button>
              ) : (
                <div className="flex gap-2 h-10">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setShowLeaveConfirm(false)
                      onOpenChange(false)
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowLeaveConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Danger Zone</h3>
              <Button variant="destructive" className="w-full" onClick={() => setShowDeleteConfirm(true)}>
                Delete Workspace
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ManageMembersDialog open={showManageMembers} onOpenChange={setShowManageMembers} />
      <WorkspaceDialog open={showEditWorkspace} onOpenChange={setShowEditWorkspace} isEdit={true} />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The workspace "{workspace}" and all its notes will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
