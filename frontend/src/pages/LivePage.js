import React, { useState } from 'react';
import { liveMatches } from '../mockData';
import { useBetting } from '../contexts/BettingContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TrendingUp, Users, Clock } from 'lucide-react';

const LivePage = () => {
  const { addToBetSlip } = useBetting();
  const [selectedSport, setSelectedSport] = useState('all');

  const handleAddToBet = (match, selection, odds) => {
    addToBetSlip({
      id: `${match.id}_${selection}`,
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      selection: selection,
      odds: odds
    });
  };

  const filteredMatches = selectedSport === 'all'
    ? liveMatches
    : liveMatches.filter(m => m.sport.toLowerCase() === selectedSport);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            <h1 className="text-3xl font-bold">Live Betting</h1>
          </div>
          <p className="text-red-100">Real-time odds on live sporting events</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sport Filters */}
        <Tabs value={selectedSport} onValueChange={setSelectedSport} className="mb-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 w-full">
            <TabsTrigger value="all">All Sports</TabsTrigger>
            <TabsTrigger value="football">Football</TabsTrigger>
            <TabsTrigger value="basketball">Basketball</TabsTrigger>
            <TabsTrigger value="tennis">Tennis</TabsTrigger>
            <TabsTrigger value="cricket">Cricket</TabsTrigger>
            <TabsTrigger value="hockey">Hockey</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredMatches.length}</p>
                <p className="text-sm text-gray-600">Live Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12,450</p>
                <p className="text-sm text-gray-600">Active Bettors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">Real-time</p>
                <p className="text-sm text-gray-600">Odds Updates</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Matches */}
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">No live matches in this category</p>
              </CardContent>
            </Card>
          ) : (
            filteredMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-xl transition-shadow border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Match Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <Badge variant="outline">{match.sport}</Badge>
                        <Badge variant="outline">{match.league}</Badge>
                        <div className="flex items-center space-x-1 text-red-600 font-semibold">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>{match.time}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">{match.homeTeam}</span>
                          <span className="text-3xl font-bold text-blue-600 ml-4">{match.homeScore}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">{match.awayTeam}</span>
                          <span className="text-3xl font-bold text-blue-600 ml-4">{match.awayScore}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Odds */}
                    <div className="lg:w-80">
                      <p className="text-sm text-gray-500 mb-2">Match Winner</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleAddToBet(match, `${match.homeTeam} Win`, match.odds.home)}
                          className="flex flex-col h-auto py-3 hover:bg-blue-50 hover:border-blue-600 transition-all"
                        >
                          <span className="text-xs text-gray-500 mb-1">Home</span>
                          <span className="text-lg font-bold text-blue-600">{match.odds.home}</span>
                        </Button>
                        {match.odds.draw && (
                          <Button
                            variant="outline"
                            onClick={() => handleAddToBet(match, 'Draw', match.odds.draw)}
                            className="flex flex-col h-auto py-3 hover:bg-blue-50 hover:border-blue-600 transition-all"
                          >
                            <span className="text-xs text-gray-500 mb-1">Draw</span>
                            <span className="text-lg font-bold text-blue-600">{match.odds.draw}</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => handleAddToBet(match, `${match.awayTeam} Win`, match.odds.away)}
                          className="flex flex-col h-auto py-3 hover:bg-blue-50 hover:border-blue-600 transition-all"
                        >
                          <span className="text-xs text-gray-500 mb-1">Away</span>
                          <span className="text-lg font-bold text-blue-600">{match.odds.away}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePage;