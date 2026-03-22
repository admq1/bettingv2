import React, { useState } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { X, Trash2 } from 'lucide-react';
import { toast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';

const BetSlip = ({ onClose }) => {
  const { betSlip, removeFromBetSlip, updateBetStake, clearBetSlip, placeBet, isAuthenticated } = useBetting();
  const [betType, setBetType] = useState('single');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalStake = betSlip.reduce((sum, bet) => sum + (bet.stake || 0), 0);
  const totalOdds = betSlip.reduce((product, bet) => product * (bet.odds || 1), 1);
  const potentialWin = totalStake * totalOdds;

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Error', description: 'Please login to place bets', variant: 'destructive' });
      return;
    }

    if (betSlip.length === 0) {
      toast({ title: 'Error', description: 'Add bets to your slip', variant: 'destructive' });
      return;
    }

    if (totalStake === 0) {
      toast({ title: 'Error', description: 'Enter stake amount', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const result = await placeBet(betSlip, totalStake);
      const firstBetId = result.bets?.[0]?.bet_id || '';
      toast({ title: 'Success!', description: `Bet placed successfully!${firstBetId ? ` Bet ID: ${firstBetId}` : ''}` });
      if (onClose) onClose();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to place bet', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between rounded-t-lg">
        <h3 className="font-bold text-lg">Bet Slip ({betSlip.length})</h3>
        <div className="flex items-center space-x-2">
          {betSlip.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearBetSlip}
              className="text-white hover:bg-blue-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-blue-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Bet Type Selector */}
      {betSlip.length > 1 && (
        <div className="p-3 border-b bg-gray-50">
          <div className="flex space-x-2">
            <Button
              variant={betType === 'single' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBetType('single')}
              className="flex-1"
            >
              Single
            </Button>
            <Button
              variant={betType === 'accumulator' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBetType('accumulator')}
              className="flex-1"
            >
              Accumulator
            </Button>
          </div>
        </div>
      )}

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {betSlip.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Your bet slip is empty</p>
            <p className="text-sm mt-2">Add selections to start betting</p>
          </div>
        ) : (
          betSlip.map((bet) => (
            <Card key={bet.id} className="p-3 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromBetSlip(bet.id)}
                className="absolute top-1 right-1 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
              
              <div className="mb-2">
                <p className="text-xs text-gray-500">{bet.league}</p>
                <p className="font-medium text-sm">{bet.homeTeam} vs {bet.awayTeam}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">{bet.selection}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-xs text-gray-500">Stake:</span>
                  <Input
                    type="number"
                    min="0"
                    step="10"
                    value={bet.stake || ''}
                    onChange={(e) => updateBetStake(bet.id, e.target.value)}
                    className="h-8 w-24"
                    placeholder="0"
                  />
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold text-sm">
                  {bet.odds}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {betSlip.length > 0 && (
        <div className="border-t p-4 bg-gray-50 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Stake:</span>
              <span className="font-semibold">₹{totalStake.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Odds:</span>
              <span className="font-semibold">{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Potential Win:</span>
              <span className="text-green-600">₹{potentialWin.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handlePlaceBet}
            disabled={loading || totalStake === 0}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg py-6"
          >
            {loading ? 'Placing Bet...' : 'Place Bet'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BetSlip;