import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBetting } from '../contexts/BettingContext';
import { userBetsHistory } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Wallet, History, Settings, TrendingUp, Trophy, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const AccountPage = () => {
  const { user, isAuthenticated } = useBetting();
  const navigate = useNavigate();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  if (!isAuthenticated || !user) {
    navigate('/');
    return null;
  }

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({ title: 'Error', description: 'Enter valid amount', variant: 'destructive' });
      return;
    }
    toast({ title: 'Redirecting to Payment', description: 'Opening payment gateway...' });
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({ title: 'Error', description: 'Enter valid amount', variant: 'destructive' });
      return;
    }
    if (parseFloat(withdrawAmount) > user.balance) {
      toast({ title: 'Error', description: 'Insufficient balance', variant: 'destructive' });
      return;
    }
    toast({ title: 'Withdrawal Requested', description: 'Your withdrawal is being processed' });
    setWithdrawAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="text-blue-200">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-2xl font-bold">{user.currency}{user.balance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Bets</p>
                  <p className="text-2xl font-bold">{user.total_bets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Wins</p>
                  <p className="text-2xl font-bold">{user.total_wins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Win Rate</p>
                  <p className="text-2xl font-bold">{user.winRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="wallet">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="bets">
              <History className="w-4 h-4 mr-2" />
              My Bets
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deposit */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                    <h3 className="text-xl font-bold">Deposit Funds</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deposit">Amount</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDepositAmount('500')}>₹500</Button>
                      <Button variant="outline" size="sm" onClick={() => setDepositAmount('1000')}>₹1000</Button>
                      <Button variant="outline" size="sm" onClick={() => setDepositAmount('2500')}>₹2500</Button>
                      <Button variant="outline" size="sm" onClick={() => setDepositAmount('5000')}>₹5000</Button>
                    </div>
                    <Button onClick={handleDeposit} className="w-full bg-green-600 hover:bg-green-700">
                      Deposit Now
                    </Button>
                    <p className="text-xs text-gray-500">Supports UPI, Cards, Net Banking, QR Code</p>
                  </div>
                </CardContent>
              </Card>

              {/* Withdraw */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                    <h3 className="text-xl font-bold">Withdraw Funds</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw">Amount</Label>
                      <Input
                        id="withdraw"
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      <p className="text-gray-700">Available: <span className="font-bold">{user.currency}{user.balance.toFixed(2)}</span></p>
                    </div>
                    <Button onClick={handleWithdraw} className="w-full bg-red-600 hover:bg-red-700">
                      Withdraw Now
                    </Button>
                    <p className="text-xs text-gray-500">Processed within 24-48 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bets Tab */}
          <TabsContent value="bets">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Betting History</h3>
                <div className="space-y-3">
                  {userBetsHistory.map((bet) => (
                    <div key={bet.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{bet.match}</p>
                          <p className="text-sm text-gray-600">{bet.selection}</p>
                        </div>
                        <Badge
                          variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}
                          className={bet.status === 'won' ? 'bg-green-600' : ''}
                        >
                          {bet.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">{bet.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Stake</p>
                          <p className="font-medium">{user.currency}{bet.stake}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Odds</p>
                          <p className="font-medium">{bet.odds}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Potential Win</p>
                          <p className="font-medium text-green-600">{user.currency}{bet.potentialWin}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(bet.date).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Username</Label>
                    <Input value={user.username} disabled />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} disabled />
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <Input value={new Date(user.join_date).toLocaleDateString()} disabled />
                  </div>
                  <div>
                    <Label>Account Status</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-green-600">Verified</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Responsible Gaming Limits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;