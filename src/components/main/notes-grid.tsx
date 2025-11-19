"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText as LuFileText, LockOpen as LuLockOpen, Clock as LuLock } from "lucide-react"
import { FiMoreVertical } from "react-icons/fi"
import { useAppStore } from "@/lib/store"

interface Note {
  id: number
  title: string
  description: string
  modifiedDate: string
  locked: boolean
  author: string
}

export function NotesGrid() {
  const { currentWorkspaceId, getNotesByWorkspace, toggleNoteLock, deleteNote, canDeleteNote, canEditNote } =
    useAppStore()
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const notes = getNotesByWorkspace(currentWorkspaceId)

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
          </>
        ) : (
          notes.map((note) => (
            <Card
              key={note.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer group border border-border hover:border-primary/50 bg-card"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <LuFileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <h3 className="font-semibold text-sm truncate">{note.title}</h3>
                </div>
                <NoteContextMenu
                  note={note}
                  onToggleLock={() => toggleNoteLock(currentWorkspaceId, note.id)}
                  onDelete={() => canDeleteNote(currentWorkspaceId, note.id) && deleteNote(currentWorkspaceId, note.id)}
                  canDelete={canDeleteNote(currentWorkspaceId, note.id)}
                  canEdit={canEditNote(currentWorkspaceId, note.id)}
                />
              </div>

              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{note.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  <span>{note.author}</span>
                  <span className="mx-1">•</span>
                  <span>{note.modifiedDate}</span>
                </div>
                {note.locked && <LuLock className="h-3 w-3" />}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function NoteContextMenu({
  note,
  onToggleLock,
  onDelete,
  canDelete,
  canEdit,
}: { note: Note; onToggleLock: () => void; onDelete: () => void; canDelete: boolean; canEdit: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <FiMoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer gap-2" onClick={onToggleLock}>
          {note.locked ? (
            <>
              <LuLockOpen className="h-4 w-4" />
              Unlock Note
            </>
          ) : (
            <>
              <LuLock className="h-4 w-4" />
              Lock Note
            </>
          )}
        </DropdownMenuItem>
        {canEdit && <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>}
        <DropdownMenuItem className="cursor-pointer">Duplicate</DropdownMenuItem>
        {canDelete && (
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={onDelete}>
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NoteSkeleton() {
  return (
    <div className="p-4 hover:shadow-md transition-shadow cursor-pointer group border border-border hover:border-primary/50 bg-card">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="h-5 w-5 bg-muted rounded flex-shrink-0"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
        <div className="h-6 w-6 bg-muted rounded"></div>
      </div>
      <div className="h-4 w-full bg-muted rounded mb-4"></div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex gap-1">
          <div className="h-4 w-16 bg-muted rounded"></div>
          <div className="h-4 w-4 bg-muted rounded"></div>
          <div className="h-4 w-16 bg-muted rounded"></div>
        </div>
        <div className="h-3 w-3 bg-muted rounded"></div>
      </div>
    </div>
  )
}
