"use client";
import { useTheme } from "./useTheme"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
    className?: string,
}
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
         className={cn(className, "h-fit w-fit rounded-xl p-4 dark:bg-neutral-900 dark:text-white bg-white text-neutral-900 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300 ")}
         onClick={toggleTheme}
         >
            {theme === "light" ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
        </button>
    )
}

export default ThemeToggle;