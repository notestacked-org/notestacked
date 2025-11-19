"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
  const { currentWorkspaceId, createNote, currentUser, addNotification } = useAppStore()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = () => {
    if (title.trim()) {
      createNote(currentWorkspaceId, {
        title,
        description,
        createdBy: currentUser.id,
        createdDate: new Date().toISOString().split("T")[0],
        modifiedDate: new Date().toISOString().split("T")[0],
        locked: false,
        author: currentUser.name,
      })

      addNotification({
        type: "note",
        title: "New Note Created",
        description: `Note "${title}" has been created`,
        workspaceId: currentWorkspaceId,
        timestamp: new Date().toISOString(),
        read: false,
      })

      setTitle("")
      setDescription("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>Add a new note to your workspace</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Note Title</label>
            <Input
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter note description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
