"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, LogOut, Heart, Menu, Video } from "lucide-react";

export default function Navigation() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-6">
          {session ? (
            <>
              <div className="flex items-center space-x-3 pb-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>

              <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </Link>

              <Link
                href="/videos-management"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  My Videos
                </Button>
              </Link>

              <Link
                href="/liked-videos"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Liked Videos
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/signin"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  const UserDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/upload" className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload Video</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/videos-management" className="cursor-pointer">
            <Video className="mr-2 h-4 w-4" />
            <span>My Videos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/liked-videos" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Liked Videos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              VideoPlatform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/upload">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </Link>

                <Link href="/videos-management">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>My Videos</span>
                  </Button>
                </Link>

                <UserDropdown />
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
