import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/ui/theme-provider";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, Moon, Sun, User, Crown } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "@/components/ui/language-selector";

const NavLink = ({ href, children, current }: { href: string; children: React.ReactNode; current: boolean }) => {
  return (
    <Link 
      href={href} 
      className={`text-sm font-medium px-3 py-4 transition-all ${
        current 
          ? "text-primary border-b-2 border-primary" 
          : "text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary border-b-2 border-transparent hover:border-primary/30"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white w-5 h-5"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 whitespace-nowrap">Get Content AI</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              <NavLink href="/dashboard" current={location === "/dashboard"}>
                Dashboard
              </NavLink>
              <NavLink href="/templates" current={location === "/templates"}>
                Templates
              </NavLink>
              <NavLink href="/history" current={location === "/history"}>
                History
              </NavLink>
              <NavLink href="/trends" current={location === "/trends"}>
                Trends
              </NavLink>
              <NavLink href="/performance" current={location === "/performance"}>
                Performance
              </NavLink>
              <NavLink href="/help" current={location === "/help"}>
                Help
              </NavLink>
              <NavLink href="/settings" current={location === "/settings"}>
                Settings
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {user && user.subscriptionStatus !== 'active' && (
              <Link href="/subscribe">
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex rounded-full w-9 h-9 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-[18px] w-[18px] text-slate-700 dark:text-slate-300" /> : <Sun className="h-[18px] w-[18px] text-slate-700 dark:text-slate-300" />}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="hidden md:inline-flex hover:bg-transparent hover:text-primary border-b border-transparent hover:border-primary/30 rounded-none px-2 py-1">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="default" asChild className="hidden md:inline-flex bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden text-slate-500"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col gap-6 mt-6">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="text-lg font-medium" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link 
                        href="/signup" 
                        className="text-lg font-medium" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                  <Link 
                    href="/dashboard" 
                    className="text-lg font-medium" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/templates" 
                    className="text-lg font-medium" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Templates
                  </Link>
                  <Link 
                    href="/history" 
                    className="text-lg font-medium" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Link 
                    href="/settings" 
                    className="text-lg font-medium" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Button onClick={toggleTheme} variant="outline" className="justify-start">
                    {theme === "light" ? (
                      <>
                        <Moon className="mr-2 h-4 w-4" /> Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="mr-2 h-4 w-4" /> Light Mode
                      </>
                    )}
                  </Button>
                  {user && (
                    <Button onClick={handleLogout} variant="destructive" className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
