import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from '../components/ui/use-toast';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAdmin = () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminUser');
      
      if (token && adminData) {
        try {
          setAdminUser(JSON.parse(adminData));
          setIsAdminAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse admin data:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      }
      setLoading(false);
    };
    initAdmin();
  }, []);

  const adminLogin = async (username, password) => {
    try {
      const response = await adminAPI.login({ username, password });
      const { admin, access_token } = response.data;
      
      localStorage.setItem('adminToken', access_token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      
      // Set token for future requests
      localStorage.setItem('token', access_token);
      
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
      
      toast({
        title: 'Success',
        description: 'Admin logged in successfully!',
      });
      
      return admin;
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid credentials';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    
    toast({
      title: 'Success',
      description: 'Admin logged out successfully',
    });
  };

  // Admin operations
  const getStats = async () => {
    try {
      const response = await adminAPI.getStats();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw error;
    }
  };

  const getUsers = async (params = {}) => {
    try {
      const response = await adminAPI.getUsers(params);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  };

  const getUserDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      throw error;
    }
  };

  const updateUser = async (userId, data) => {
    try {
      const response = await adminAPI.updateUser(userId, data);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update user';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getBets = async (params = {}) => {
    try {
      const response = await adminAPI.getBets(params);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bets:', error);
      throw error;
    }
  };

  const settleBet = async (betId, result, adminNotes) => {
    try {
      const response = await adminAPI.settleBet({
        bet_id: betId,
        result,
        admin_notes: adminNotes,
      });
      toast({
        title: 'Success',
        description: `Bet settled as ${result}`,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to settle bet';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getTransactions = async (params = {}) => {
    try {
      const response = await adminAPI.getTransactions(params);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  };

  const processTransaction = async (transactionId, action, adminNotes) => {
    try {
      const response = await adminAPI.processTransaction({
        transaction_id: transactionId,
        action,
        admin_notes: adminNotes,
      });
      toast({
        title: 'Success',
        description: `Transaction ${action}d successfully`,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to process transaction';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getPaymentSettings = async () => {
    try {
      const response = await adminAPI.getPaymentSettings();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
      throw error;
    }
  };

  const updatePaymentSettings = async (settings) => {
    try {
      const response = await adminAPI.updatePaymentSettings(settings);
      toast({
        title: 'Success',
        description: 'Payment settings updated',
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update settings';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    adminUser,
    isAdminAuthenticated,
    loading,
    adminLogin,
    adminLogout,
    getStats,
    getUsers,
    getUserDetails,
    updateUser,
    getBets,
    settleBet,
    getTransactions,
    processTransaction,
    getPaymentSettings,
    updatePaymentSettings,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
