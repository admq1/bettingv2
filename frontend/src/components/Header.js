import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBetting } from '../contexts/BettingContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, Wallet, LogOut, Search, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';

const Header = () => {
  const { user, isAuthenticated, logout } = useBetting();
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 border-b border-blue-700">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">
                R
              </div>
              <span className="text-2xl font-bold tracking-tight">RUDRABET</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search matches, teams..."
                  className="pl-10 bg-blue-800/50 border-blue-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <>
                  <div className="hidden md:flex items-center space-x-2 bg-blue-800/50 px-4 py-2 rounded-lg">
                    <Wallet className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">{user.currency}{user.balance.toFixed(2)}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="hidden md:inline">{user.username}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/account')}>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account/bets')}>
                        My Bets
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account/transactions')}>
                        Transactions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button onClick={() => setShowLogin(true)} variant="ghost" className="hidden md:inline-flex">
                    Login
                  </Button>
                  <Button onClick={() => setShowLogin(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Sign Up
                  </Button>
                </>
              )}
              
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1 py-2">
            <Link to="/">
              <Button variant="ghost" className="hover:bg-blue-700">Home</Button>
            </Link>
            <Link to="/live">
              <Button variant="ghost" className="hover:bg-blue-700 flex items-center space-x-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span>Live</span>
              </Button>
            </Link>
            <Link to="/sports">
              <Button variant="ghost" className="hover:bg-blue-700">Sports</Button>
            </Link>
            <Link to="/casino">
              <Button variant="ghost" className="hover:bg-blue-700">Casino</Button>
            </Link>
            <Link to="/promotions">
              <Button variant="ghost" className="hover:bg-blue-700">Promotions</Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start hover:bg-blue-700">Home</Button>
              </Link>
              <Link to="/live" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start hover:bg-blue-700">Live</Button>
              </Link>
              <Link to="/sports" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start hover:bg-blue-700">Sports</Button>
              </Link>
              <Link to="/casino" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start hover:bg-blue-700">Casino</Button>
              </Link>
              <Link to="/promotions" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start hover:bg-blue-700">Promotions</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;