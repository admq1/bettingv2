import React, { useState } from 'react';
import { casinoGames } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Play, Star } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const CasinoPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filteredGames = casinoGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || game.category.toLowerCase().includes(category.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handlePlayGame = (game) => {
    toast({ title: 'Loading Game', description: `Starting ${game.name}...` });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Live Casino</h1>
          <p className="text-purple-200">Experience the thrill of real casino games</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search casino games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="live">Live Casino</TabsTrigger>
            <TabsTrigger value="slots">Slots</TabsTrigger>
            <TabsTrigger value="table">Table Games</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredGames.map((game) => (
            <Card key={game.id} className="overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
              <div className="relative">
                <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    onClick={() => handlePlayGame(game)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </div>
                {game.category === 'Live Casino' && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-semibold text-sm mb-1">{game.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{game.provider}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No games found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CasinoPage;