import React from "react";
import { signOut } from 'firebase/auth';
import { auth } from "@/config/firebase";
import { Separator } from "@/components/ui/separator";
import { Dock, DockIcon } from "@/components/ui/dock";
import { House, User, Search, LayoutList } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';

export type IconProps = React.HTMLAttributes<SVGElement>;

export function NavBar() {
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase'den signOut işlemi
    } catch (error) {
      console.error('Logout failed: ', error);
    }
  };

  const fullName = auth.currentUser?.displayName ?? "User";
  console.log(auth.currentUser);

  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-12 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
    <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
    <Dock direction="middle" className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
        <DockIcon>
            <TooltipProvider> <Tooltip >
                <TooltipTrigger asChild>
                <House onClick={() => handleNavigate('/')} className="size-6" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>MainPage</p>
                </TooltipContent>
            </Tooltip> </TooltipProvider>
            
        </DockIcon>
        <DockIcon>
            <TooltipProvider> <Tooltip >
                <TooltipTrigger asChild>
                <Search onClick={() => handleNavigate('/search')} className="size-6" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Search</p>
                </TooltipContent>
            </Tooltip> </TooltipProvider>
            
        </DockIcon>
        <DockIcon>
            <TooltipProvider> <Tooltip >
                <TooltipTrigger asChild>
                <LayoutList className="size-6" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add to library</p>
                </TooltipContent>
            </Tooltip> </TooltipProvider>
            
        </DockIcon>
        <Separator orientation="vertical" className="h-full" />
        <DockIcon>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <User className="size-6 cursor-pointer" /> 
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
              <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DockIcon>
      </Dock>
    </div>
  );
}

