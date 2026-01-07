'use client';

import { Bell, Search, Settings, User, ChevronDown, LayoutDashboard, Building2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface HeaderProps {
  isAdminView: boolean;
  onToggleView: () => void;
  onMobileMenuToggle: () => void;
}

export function Header({ isAdminView, onToggleView, onMobileMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-gray-600" onClick={onMobileMenuToggle}>
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg text-gray-900 hidden sm:block">ACRE Notebook</span>
        </div>

        {/* View Toggle - Hidden on mobile, moved to menu potentially later, strict requirement focus first */}
        <div className="hidden md:flex items-center gap-2 ml-8 px-3 py-1.5 bg-gray-100 rounded-full">
          <LayoutDashboard className={`w-4 h-4 ${!isAdminView ? 'text-blue-600' : 'text-gray-400'}`} />
          <Switch
            checked={isAdminView}
            onCheckedChange={onToggleView}
            className="data-[state=checked]:bg-blue-600"
          />
          <Building2 className={`w-4 h-4 ${isAdminView ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className="text-sm font-medium text-gray-600 ml-1">
            {isAdminView ? 'Admin' : 'Client'}
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-transparent md:hover:bg-accent">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900">ACRE Partner</p>
                  <p className="text-xs text-gray-500">partner@acre.com</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
