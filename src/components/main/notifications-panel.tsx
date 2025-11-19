"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { FiX, FiBell, FiUsers, FiFileText, FiTrendingUp } from "react-icons/fi"
import { formatDistanceToNow } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { JSX } from "react/jsx-runtime"

interface Notification {
  id: string
  type: "invitation" | "note" | "update"
  title: string
  message: string
  timestamp: Date
  read: boolean
  icon: JSX.Element
  workspaceId?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "invitation",
    title: "You've been invited",
    message: 'Sarah invited you to "Marketing Campaign" workspace',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    icon: <FiUsers className="h-4 w-4" />,
    workspaceId: "ws-1",
  },
  {
    id: "2",
    type: "note",
    title: "Note created",
    message: 'John created a new note "Q1 Planning" in Design Team',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    icon: <FiFileText className="h-4 w-4" />,
  },
  {
    id: "3",
    type: "update",
    title: "Workspace updated",
    message: 'Emily promoted to Admin in "Product Design" workspace',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
    icon: <FiTrendingUp className="h-4 w-4" />,
  },
  {
    id: "4",
    type: "invitation",
    title: "You've been invited",
    message: 'Mike invited you to "Engineering" workspace',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    icon: <FiUsers className="h-4 w-4" />,
    workspaceId: "ws-2",
  },
  {
    id: "5",
    type: "note",
    title: "Note created",
    message: 'Alex created a new note "Sprint Review" in Development',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    icon: <FiFileText className="h-4 w-4" />,
  },
]

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [openPopover, setOpenPopover] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleConfirmInvitation = (id: string) => {
    console.log("Invitation confirmed:", id)
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleCancelInvitation = (id: string) => {
    console.log("Invitation declined:", id)
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getNotificationBgColor = (type: string, theme: "light" | "dark") => {
    if (theme === "dark") {
      switch (type) {
        case "invitation":
          return "bg-blue-950 border-blue-800"
        case "note":
          return "bg-purple-950 border-purple-800"
        case "update":
          return "bg-green-950 border-green-800"
        default:
          return "bg-background-secondary border-border"
      }
    } else {
      switch (type) {
        case "invitation":
          return "bg-blue-50 border-blue-200"
        case "note":
          return "bg-purple-50 border-purple-200"
        case "update":
          return "bg-green-50 border-green-200"
        default:
          return "bg-background-secondary border-border"
      }
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "invitation":
        return "text-blue-600 dark:text-blue-400"
      case "note":
        return "text-purple-600 dark:text-purple-400"
      case "update":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-background-secondary rounded-lg transition-colors">
          <FiBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FiBell className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs h-auto py-1 px-2">
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[400px]">
            <div className="p-3 space-y-2">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center h-full py-8 text-muted-foreground">
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all ${getNotificationBgColor(
                      notification.type,
                      "light",
                    )} dark:${getNotificationBgColor(notification.type, "dark")} group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 ${getIconColor(notification.type)}`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm text-foreground">{notification.title}</h3>
                          {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>

                        {notification.type === "invitation" && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleConfirmInvitation(notification.id)}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs bg-transparent"
                              onClick={() => handleCancelInvitation(notification.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="p-1 hover:bg-background rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      >
                        <FiX className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
