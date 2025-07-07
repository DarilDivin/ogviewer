"use client"

// import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { SunMediumIcon, MoonStarIcon } from "lucide-react"

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center font-poppins">
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="w-8 h-8 text-sm flex justify-center items-center rounded-full hover:bg-black/10 hover:dark:bg-white/20 transition">
        {theme == "light" 
        ? (<MoonStarIcon  height={24} width={24}/>)
        : (<SunMediumIcon  height={24} width={24}/>)}
        
      </button>
    </div>
  );
};

export default DarkModeToggle;
