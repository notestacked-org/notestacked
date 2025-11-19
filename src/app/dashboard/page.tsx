
"use client";
import { Sidebar } from "@/components/main/sidebar";
import { MainContent } from "@/components/main/main-content";
import { useAppStore } from "@/lib/store";
import { redirect } from "next/navigation";
import { useValidate } from "@/features/auth/api/useValidate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
 function DashboardClient() {   
  const { currentWorkspace, theme, setTheme } = useAppStore();

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark");
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No workspace selected</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <MainContent 
        workspace={currentWorkspace.name}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    </div>
  );
}
export default  function DashboardPage() {
  // 1️⃣ Validate on the server
  const router = useRouter();

  const { data, isLoading, isError, isSuccess } = useValidate();
  const { currentWorkspace, theme, setTheme } = useAppStore();

  // Redirect after validation finishes
  useEffect(() => {
    if (!isLoading && isSuccess && !data?.success) {
      router.push("/auth/signin");
    }
  }, [isLoading, isSuccess, data, router]);
  
  if(isLoading){
    return(
      <div className="flex items-center justify-center h-screen"> 
        <p className="text-gray-500">Validating session...</p>
      </div>
    )
  }

  // 2️⃣ Render client component
  return <DashboardClient />;
}
