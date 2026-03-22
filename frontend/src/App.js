import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BettingProvider } from './contexts/BettingContext';
import { AdminProvider } from './contexts/AdminContext';
import { Toaster } from './components/ui/toaster';
import Header from './components/Header';
import Footer from './components/Footer';
import BetSlip from './components/BetSlip';
import HomePage from './pages/HomePage';
import LivePage from './pages/LivePage';
import CasinoPage from './pages/CasinoPage';
import PromotionsPage from './pages/PromotionsPage';
import AccountPage from './pages/AccountPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBets from './pages/admin/AdminBets';
import AdminPayments from './pages/admin/AdminPayments';
import { Button } from './components/ui/button';
import { ShoppingCart, X } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { useBetting } from './contexts/BettingContext';
import './App.css';

const BetSlipToggle = () => {
  const { betSlip } = useBetting();
  const [showBetSlip, setShowBetSlip] = useState(false);

  return (
    <>
      {/* Floating Bet Slip Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowBetSlip(!showBetSlip)}
          className="relative h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black"
        >
          <ShoppingCart className="w-6 h-6" />
          {betSlip.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-600">
              {betSlip.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Bet Slip Panel */}
      {showBetSlip && (
        <div className="fixed inset-0 z-50 lg:inset-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-96">
          <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setShowBetSlip(false)} />
          <div className="relative h-full lg:shadow-2xl">
            <BetSlip onClose={() => setShowBetSlip(false)} />
          </div>
        </div>
      )}
    </>
  );
};

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BetSlipToggle />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <BettingProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/bets" element={<AdminBets />} />
            <Route path="/admin/payments" element={<AdminPayments />} />

            {/* User Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/live" element={<MainLayout><LivePage /></MainLayout>} />
            <Route path="/sports" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/sports/:sport" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/casino" element={<MainLayout><CasinoPage /></MainLayout>} />
            <Route path="/promotions" element={<MainLayout><PromotionsPage /></MainLayout>} />
            <Route path="/account" element={<MainLayout><AccountPage /></MainLayout>} />
            <Route path="/account/:tab" element={<MainLayout><AccountPage /></MainLayout>} />
          </Routes>
          <Toaster />
        </BettingProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;