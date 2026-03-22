import React from 'react';
import { Link } from 'react-router-dom';
import { liveMatches, upcomingMatches, sportsData, casinoGames, promotions } from '../mockData';
import { useBetting } from '../contexts/BettingContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { TrendingUp, Trophy, Clock, Play } from 'lucide-react';

const HomePage = () => {
  const { addToBetSlip } = useBetting();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Promotions */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <Card key={promo.id} className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 hover:scale-105 transition-transform cursor-pointer">
                <img src={promo.image} alt={promo.title} className="w-full h-40 object-cover" />
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-white mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-200 mb-3">{promo.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-500 text-black font-semibold">{promo.code}</Badge>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30">Claim Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Quick Access */}
      <section className="py-8 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold">Popular Sports</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {sportsData.map((sport) => (
              <Link key={sport.id} to={`/sports/${sport.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-500">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{sport.icon}</div>
                    <p className="font-semibold text-sm">{sport.name}</p>
                    <div className="flex items-center justify-center space-x-2 mt-2 text-xs text-gray-500">
                      <span>{sport.matches} matches</span>
                      {sport.live > 0 && (
                        <Badge variant="destructive" className="text-xs">Live {sport.live}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Matches */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold">Live Now</h2>
            </div>
            <Link to="/live">
              <Button variant="outline" size="sm">View All Live</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{match.league}</Badge>
                    <div className="flex items-center space-x-1 text-red-600 font-semibold text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>{match.time}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{match.homeTeam}</span>
                      <span className="text-2xl font-bold text-blue-600">{match.homeScore}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{match.awayTeam}</span>
                      <span className="text-2xl font-bold text-blue-600">{match.awayScore}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToBet(match, `${match.homeTeam} Win`, match.odds.home)}
                      className="flex flex-col h-auto py-2 hover:bg-blue-50 hover:border-blue-500"
                    >
                      <span className="text-xs text-gray-500">Home</span>
                      <span className="font-bold text-blue-600">{match.odds.home}</span>
                    </Button>
                    {match.odds.draw && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToBet(match, 'Draw', match.odds.draw)}
                        className="flex flex-col h-auto py-2 hover:bg-blue-50 hover:border-blue-500"
                      >
                        <span className="text-xs text-gray-500">Draw</span>
                        <span className="font-bold text-blue-600">{match.odds.draw}</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToBet(match, `${match.awayTeam} Win`, match.odds.away)}
                      className="flex flex-col h-auto py-2 hover:bg-blue-50 hover:border-blue-500"
                    >
                      <span className="text-xs text-gray-500">Away</span>
                      <span className="font-bold text-blue-600">{match.odds.away}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            </div>
            <Link to="/sports">
              <Button variant="outline" size="sm">View All Sports</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {upcomingMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Badge variant="outline" className="text-xs mb-3">{match.league}</Badge>
                  
                  <div className="space-y-2 mb-3">
                    <p className="font-semibold">{match.homeTeam}</p>
                    <p className="text-sm text-gray-500">vs</p>
                    <p className="font-semibold">{match.awayTeam}</p>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(match.startTime).toLocaleString()}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToBet(match, `${match.homeTeam} Win`, match.odds.home)}
                      className="flex flex-col h-auto py-2 hover:bg-blue-50 hover:border-blue-500"
                    >
                      <span className="text-xs text-gray-500">Home</span>
                      <span className="font-bold text-blue-600">{match.odds.home}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToBet(match, `${match.awayTeam} Win`, match.odds.away)}
                      className="flex flex-col h-auto py-2 hover:bg-blue-50 hover:border-blue-500"
                    >
                      <span className="text-xs text-gray-500">Away</span>
                      <span className="font-bold text-blue-600">{match.odds.away}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Casino Preview */}
      <section className="py-8 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Live Casino</h2>
            </div>
            <Link to="/casino">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">Explore Casino</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {casinoGames.map((game) => (
              <Card key={game.id} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <img src={game.image} alt={game.name} className="w-full h-32 object-cover" />
                <CardContent className="p-3">
                  <p className="font-semibold text-sm text-black">{game.name}</p>
                  <p className="text-xs text-gray-600">{game.provider}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Rudrabet?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">Best Odds</h3>
                <p className="text-sm text-gray-600">Competitive odds across all sports</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Live Betting</h3>
                <p className="text-sm text-gray-600">Real-time betting on live events</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-bold mb-2">Live Casino</h3>
                <p className="text-sm text-gray-600">Top casino games with live dealers</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">Fast Payouts</h3>
                <p className="text-sm text-gray-600">Quick and secure withdrawals</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;