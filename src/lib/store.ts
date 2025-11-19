import {create} from "zustand"
import {persist} from "zustand/middleware"
import {User,RecentNote,Note,Notification,Role} from "@prisma/client"

export interface workspace{
  
  workspaceId: string;
  name: string;
  description: string | null;
  slug: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  joinedAt: string; // or Date if you return Date from backend
}
export interface workspaceMember {
  id: string;
  email: string;
  name: string | null | undefined;
  profilePic: string | null | undefined;
  role: Role;
  joinedAt: string;   // ← if API sends ISO string
}

interface AppStore{
  role:Role | null;
  setRole:(role:Role|null)=>void;
  user : User | null;
  deriveRole:()=>void;
  setUser:(user:User|null)=>void;
  currentWorkspace:workspace | null;
  workspaces:workspace[] | null;
  setWorkspaces:(workspaces:workspace[]|null)=>void;
  setCurrentWorkspace:(workspace:workspace)=>void;
  workspaceMembers:workspaceMember[] | null;
  setWorkspaceMembers:(members:workspaceMember[])=>void;
  recentNotes:(RecentNote & { title:string})[]|null;
  setRecentNotes:(notes:(RecentNote & { title:string})[])=>void;
  notes:Note[]|null;
  setNotes:(notes:Note[]|null)=>void;
  notifications:Notification[]|null;
  setNotifications:(notifications:Notification[]|null)=>void;
  theme:"light"|"dark";
  setTheme:(theme:"light"|"dark")=>void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set)=>({
      user:null,
      role:null,
      setRole:(role)=>set({role:role}),
      deriveRole:()=>{
        const {user,workspaceMembers}=useAppStore.getState();
        if(!user || !workspaceMembers)return;
        const userId=user.id;
        const member = workspaceMembers.find((wm) => wm.id === userId);
        if (member) {
          useAppStore.getState().setRole(member.role);
        }
      },
      workspaces:null,
      setWorkspaces:(workspaces)=>set({workspaces}),
      setUser:(user)=>set({user}),
      currentWorkspace:null,
      setCurrentWorkspace:(workspace)=>set({currentWorkspace:workspace}),
      workspaceMembers:null,
      setWorkspaceMembers:(members)=>set({workspaceMembers:members}),
      recentNotes:null,
      setRecentNotes:(notes)=>set({recentNotes:notes}),
      notes:null,
      setNotes:(notes)=>set({notes}),
      notifications:null,
      setNotifications:(notifications)=>set({notifications}),
      theme:"light",
      setTheme:(theme)=>set({theme}),
    }),{
      name:"app-store",
    }
  )
)