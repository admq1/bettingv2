import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { adminPaymentTransactions, adminStats } from '../../mockData';
import { Wallet, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '../../components/ui/use-toast';
import { Textarea } from '../../components/ui/textarea';

const AdminPayments = () => {
  const [transactions] = useState(adminPaymentTransactions);
  const [filter, setFilter] = useState('all');
  const [qrCode, setQrCode] = useState('UPI_MERCHANT_QR_CODE_HERE');
  const [upiId, setUpiId] = useState('merchant@upi');

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  const handleApproveWithdrawal = (txId) => {
    toast({ title: 'Withdrawal Approved', description: 'Payment has been processed' });
  };

  const handleRejectWithdrawal = (txId) => {
    toast({ title: 'Withdrawal Rejected', description: 'Payment has been rejected', variant: 'destructive' });
  };

  const handleSavePaymentSettings = () => {
    toast({ title: 'Settings Saved', description: 'Payment settings updated successfully' });
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Payment Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Deposits</p>
                  <p className="text-2xl font-bold">₹{(adminStats.totalDeposits / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Withdrawals</p>
                  <p className="text-2xl font-bold">₹{(adminStats.totalWithdrawals / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">₹{(adminStats.pendingWithdrawals / 1000).toFixed(0)}K</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Net Balance</p>
                  <p className="text-2xl font-bold">₹{((adminStats.totalDeposits - adminStats.totalWithdrawals) / 1000000).toFixed(1)}M</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Payment Settings</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Filters */}
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'deposit' ? 'default' : 'outline'}
                onClick={() => setFilter('deposit')}
              >
                Deposits
              </Button>
              <Button
                variant={filter === 'withdrawal' ? 'default' : 'outline'}
                onClick={() => setFilter('withdrawal')}
              >
                Withdrawals
              </Button>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-semibold">{tx.user}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={tx.type === 'deposit' ? 'default' : 'secondary'}>
                              {tx.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">{tx.method}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold">₹{tx.amount.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                tx.status === 'completed' ? 'default' :
                                tx.status === 'pending' ? 'secondary' :
                                'outline'
                              }
                              className={
                                tx.status === 'completed' ? 'bg-green-600' :
                                tx.status === 'processing' ? 'bg-yellow-600' : ''
                              }
                            >
                              {tx.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{tx.time}</td>
                          <td className="px-6 py-4">
                            {tx.type === 'withdrawal' && tx.status === 'pending' && (
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:bg-green-50"
                                  onClick={() => handleApproveWithdrawal(tx.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => handleRejectWithdrawal(tx.id)}
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
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Code Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="qr-code">Merchant QR Code</Label>
                    <Textarea
                      id="qr-code"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      placeholder="Paste your merchant QR code data here"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload or paste your UPI merchant QR code for direct payments
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="upi-id">UPI ID</Label>
                    <Input
                      id="upi-id"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="your-merchant@upi"
                    />
                  </div>
                  <Button onClick={handleSavePaymentSettings} className="w-full">
                    Save QR Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">UPI Payment</p>
                        <p className="text-xs text-gray-500">Real-time UPI payments</p>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">QR Code</p>
                        <p className="text-xs text-gray-500">Scan and pay</p>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">Bank Transfer</p>
                        <p className="text-xs text-gray-500">Direct bank transfers</p>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">Card Payment</p>
                        <p className="text-xs text-gray-500">Credit/Debit cards</p>
                      </div>
                      <Badge variant="secondary">Inactive</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Withdrawal Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="min-withdrawal">Minimum Withdrawal</Label>
                    <Input id="min-withdrawal" type="number" placeholder="500" />
                  </div>
                  <div>
                    <Label htmlFor="max-withdrawal">Maximum Withdrawal</Label>
                    <Input id="max-withdrawal" type="number" placeholder="100000" />
                  </div>
                  <div>
                    <Label htmlFor="processing-time">Processing Time (hours)</Label>
                    <Input id="processing-time" type="number" placeholder="24" />
                  </div>
                  <Button onClick={handleSavePaymentSettings} className="w-full">
                    Save Withdrawal Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Transaction Fees */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="deposit-fee">Deposit Fee (%)</Label>
                    <Input id="deposit-fee" type="number" placeholder="0" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="withdrawal-fee">Withdrawal Fee (%)</Label>
                    <Input id="withdrawal-fee" type="number" placeholder="2" step="0.1" />
                  </div>
                  <Button onClick={handleSavePaymentSettings} className="w-full">
                    Save Fee Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;