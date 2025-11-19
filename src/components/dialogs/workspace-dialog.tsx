"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"

interface WorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEdit?: boolean
  workspaceId?: string
}

export function WorkspaceDialog({ open, onOpenChange, isEdit = false, workspaceId }: WorkspaceDialogProps) {
  const { createWorkspace, updateWorkspace, workspaces } = useAppStore()
  const editingWorkspace = workspaceId ? workspaces.find((w) => w.id === workspaceId) : null

  const [workspaceName, setWorkspaceName] = useState(editingWorkspace?.name || "")
  const [slug, setSlug] = useState(editingWorkspace?.slug || "")
  const [description, setDescription] = useState(editingWorkspace?.description || "")
  const [imagePreview, setImagePreview] = useState<string | null>(editingWorkspace?.image || null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setWorkspaceName(name)
    if (!isEdit) {
      setSlug(generateSlug(name))
    }
  }

  const handleCreate = () => {
    if (workspaceName.trim() && slug.trim()) {
      if (isEdit && workspaceId) {
        updateWorkspace(workspaceId, {
          name: workspaceName,
          slug,
          description,
          image: imagePreview || undefined,
        })
      } else {
        createWorkspace({
          name: workspaceName,
          slug,
          description,
          image: imagePreview || undefined,
          owner: "Current User",
          ownerId: "user-1",
          createdDate: new Date().toISOString().split("T")[0],
        })
      }
      setWorkspaceName("")
      setSlug("")
      setDescription("")
      setImagePreview(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Workspace Details" : "Create New Workspace"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your workspace details and settings."
              : "Set up a new workspace with a custom image and description."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Workspace Image</Label>
            <div className="flex gap-3">
              <div className="w-24 h-24 rounded-lg bg-muted border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-3xl">🏢</div>
                )}
              </div>
              <div className="flex flex-col gap-2 justify-center flex-1">
                <Input type="file" accept="image/*" onChange={handleImageSelect} className="text-xs" />
                <p className="text-xs text-muted-foreground">JPG, PNG, or GIF. Max 2MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              placeholder="e.g., Marketing Team"
              value={workspaceName}
              onChange={handleNameChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL-friendly)</Label>
            <Input
              id="slug"
              placeholder="auto-generated"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-sm"
              disabled={!isEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your workspace..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!workspaceName.trim() || !slug.trim()}>
            {isEdit ? "Update Workspace" : "Create Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
