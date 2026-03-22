import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { adminRecentBets } from '../../mockData';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '../../components/ui/use-toast';

const AdminBets = () => {
  const [bets] = useState(adminRecentBets);
  const [filter, setFilter] = useState('all');

  const filteredBets = filter === 'all' ? bets : bets.filter(bet => bet.status === filter);

  const handleSettleBet = (betId, result) => {
    toast({ 
      title: 'Bet Settled', 
      description: `Bet has been marked as ${result}`,
      variant: result === 'won' ? 'default' : 'destructive'
    });
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Bets Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Bets</p>
                  <p className="text-3xl font-bold">{bets.filter(b => b.status === 'pending').length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Won Bets</p>
                  <p className="text-3xl font-bold">{bets.filter(b => b.status === 'won').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Lost Bets</p>
                  <p className="text-3xl font-bold">{bets.filter(b => b.status === 'lost').length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Bets</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="won">Won</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Bets List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Odds</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Potential Win</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBets.map((bet) => (
                    <tr key={bet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{bet.user}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{bet.match}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">₹{bet.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{bet.odds}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-600">₹{bet.potential.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={bet.status === 'won' ? 'default' : bet.status === 'lost' ? 'destructive' : 'secondary'}
                          className={bet.status === 'won' ? 'bg-green-600' : ''}
                        >
                          {bet.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{bet.time}</td>
                      <td className="px-6 py-4">
                        {bet.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleSettleBet(bet.id, 'won')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleSettleBet(bet.id, 'lost')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBets;