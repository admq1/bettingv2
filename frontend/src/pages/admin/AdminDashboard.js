import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, TrendingUp, Wallet, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const AdminDashboard = () => {
  const { isAdminAuthenticated, getStats, getUsers, getBets } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBets, setRecentBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsData, usersData, betsData] = await Promise.all([
          getStats(),
          getUsers({ limit: 5 }),
          getBets({ limit: 5 })
        ]);
        
        setStats(statsData);
        setRecentUsers(usersData);
        setRecentBets(betsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdminAuthenticated, navigate, getStats, getUsers, getBets]);

  if (!isAdminAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{stats?.total_users?.toLocaleString() || 0}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {stats?.active_users?.toLocaleString() || 0} active
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Bets</p>
                  <p className="text-3xl font-bold">{stats?.total_bets?.toLocaleString() || 0}</p>
                  <p className="text-sm text-blue-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stats?.today_stats?.bets?.toLocaleString() || 0} today
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Deposits</p>
                  <p className="text-3xl font-bold">₹{((stats?.total_deposits || 0) / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                    ₹{((stats?.today_stats?.deposits || 0) / 1000).toFixed(0)}K today
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Revenue</p>
                  <p className="text-3xl font-bold">₹{((stats?.revenue || 0) / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-yellow-600 mt-1 flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Net profit
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{user.balance?.toLocaleString() || 0}</p>
                      <Badge variant={user.verified ? 'default' : 'secondary'} className="text-xs">
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No users yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBets.length > 0 ? recentBets.map((bet) => (
                  <div key={bet.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{bet.username}</p>
                        <p className="text-xs text-gray-500">{bet.home_team} vs {bet.away_team}</p>
                      </div>
                      <Badge
                        variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}
                        className={`text-xs ${bet.status === 'won' ? 'bg-green-600' : ''}`}
                      >
                        {bet.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Stake: ₹{bet.stake}</span>
                      <span className="text-gray-500">Odds: {bet.odds}</span>
                      <span className="font-semibold text-green-600">₹{bet.potential_win?.toFixed(2)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No bets yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;