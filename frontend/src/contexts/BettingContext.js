import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, betAPI, transactionAPI } from '../services/api';
import { toast } from '../components/ui/use-toast';

const BettingContext = createContext();

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within BettingProvider');
  }
  return context;
};

export const BettingProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [betSlip, setBetSlip] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { user: userData, access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      
      return userData;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { user: userData, access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      
      return userData;
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setBetSlip([]);
    toast({
      title: 'Success',
      description: 'Logged out successfully',
    });
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const addToBetSlip = (bet) => {
    const existingBet = betSlip.find(b => b.id === bet.id);
    if (existingBet) {
      setBetSlip(betSlip.filter(b => b.id !== bet.id));
      toast({
        title: 'Removed from bet slip',
        description: `${bet.homeTeam} vs ${bet.awayTeam}`,
      });
    } else {
      setBetSlip([...betSlip, { ...bet, stake: 100 }]);
      toast({
        title: 'Added to bet slip',
        description: `${bet.homeTeam} vs ${bet.awayTeam}`,
      });
    }
  };

  const removeFromBetSlip = (betId) => {
    setBetSlip(betSlip.filter(b => b.id !== betId));
  };

  const updateBetStake = (betId, stake) => {
    setBetSlip(betSlip.map(b => 
      b.id === betId ? { ...b, stake: parseFloat(stake) || 0 } : b
    ));
  };

  const clearBetSlip = () => {
    setBetSlip([]);
  };

  const placeBet = async (bets, totalStake) => {
    if (!isAuthenticated) {
      toast({
        title: 'Error',
        description: 'Please login to place bets',
        variant: 'destructive',
      });
      throw new Error('Not authenticated');
    }

    try {
      const betPromises = bets.map(bet => 
        betAPI.placeBet({
          match_id: bet.matchId || `match_${Date.now()}`,
          selection: bet.selection,
          odds: bet.odds,
          stake: bet.stake,
          bet_type: bets.length > 1 ? 'accumulator' : 'single',
          home_team: bet.homeTeam,
          away_team: bet.awayTeam,
          league: bet.league,
          sport: bet.sport || 'Football',
        })
      );

      const results = await Promise.all(betPromises);
      
      // Refresh user balance
      await refreshUser();
      
      // Clear bet slip
      clearBetSlip();
      
      toast({
        title: 'Success!',
        description: `${bets.length} bet(s) placed successfully!`,
      });
      
      return { success: true, bets: results.map(r => r.data) };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to place bet';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    betSlip,
    loading,
    login,
    register,
    logout,
    refreshUser,
    addToBetSlip,
    removeFromBetSlip,
    updateBetStake,
    clearBetSlip,
    placeBet,
  };

  return (
    <BettingContext.Provider value={value}>
      {children}
    </BettingContext.Provider>
  );
};
