import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';
import { Shield } from 'lucide-react';

const AdminLoginModal = ({ open, onClose }) => {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(credentials.username, credentials.password);
      navigate('/admin');
      onClose();
    } catch (error) {
      // Error already handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold">Admin Login</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="admin-username">Admin Username</Label>
            <Input
              id="admin-username"
              type="text"
              placeholder="Enter admin username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
          </Button>
          <p className="text-xs text-center text-gray-500">
            Demo credentials: admin / admin123
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;