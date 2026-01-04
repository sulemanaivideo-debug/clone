import { Menu, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card shadow-md border border-white/5 transition-all focus-within:bg-card/80 focus-within:shadow-lg focus-within:border-white/10">
        
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search in emails" 
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
          />
        </div>

        <button className="relative ml-2">
          <Avatar className="w-8 h-8 border border-white/10">
            {/* Using a static user image or initial for the profile */}
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-green-600 text-white font-medium text-sm">S</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
