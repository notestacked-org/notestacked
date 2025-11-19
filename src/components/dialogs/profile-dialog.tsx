"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  )
  const [formData, setFormData] = useState({
    name: "Alex Kumar",
    email: "alex@example.com",
    username: "alexkumar",
    dob: "1995-03-15",
  })

  const [editFormData, setEditFormData] = useState(formData)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = () => {
    setEditFormData(formData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setFormData(editFormData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogDescription>Manage your profile information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
              {isEditing && (
                <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-muted-foreground">Profile Photo</p>
              {isEditing && <p className="text-xs text-muted-foreground">Hover to change</p>}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            {!isEditing ? (
              <>
                {/* Display Mode */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-sm font-medium mt-1">{formData.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium mt-1">{formData.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Username</Label>
                    <p className="text-sm font-medium mt-1">@{formData.username}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Date of Birth</Label>
                    <p className="text-sm font-medium mt-1">
                      {new Date(formData.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-xs font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                      placeholder="Enter username"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob" className="text-xs font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={editFormData.dob}
                      onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button onClick={handleEdit} className="flex-1" variant="default">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="flex-1" variant="default">
                  Save Changes
                </Button>
                <Button onClick={handleCancel} className="flex-1 bg-transparent" variant="outline">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
