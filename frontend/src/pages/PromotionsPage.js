import React from 'react';
import { promotions } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Gift, TrendingUp, Users, Clock } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const PromotionsPage = () => {
  const handleClaimBonus = (promo) => {
    toast({
      title: 'Bonus Claimed!',
      description: `${promo.title} has been added to your account. Use code: ${promo.code}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-2">
            <Gift className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Promotions & Bonuses</h1>
          </div>
          <p className="text-yellow-100">Exclusive offers and rewards for our players</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Promotions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <Card key={promo.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <img src={promo.image} alt={promo.title} className="w-full h-48 object-cover" />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-gray-600 mb-4">{promo.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-yellow-500 text-black font-bold text-sm px-3 py-1">
                      {promo.code}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleClaimBonus(promo)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                  >
                    Claim Bonus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ongoing Promotions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ongoing Promotions</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">Accumulator Boost</h3>
                    <p className="text-gray-600 mb-3">
                      Get up to 50% bonus on your accumulator bets! Add 3 or more selections with odds 1.40+ each.
                    </p>
                    <Badge variant="outline">ACCA50</Badge>
                  </div>
                  <Button>Claim</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">Refer a Friend</h3>
                    <p className="text-gray-600 mb-3">
                      Invite friends and earn ₹500 for each friend who signs up and makes a deposit.
                    </p>
                    <Badge variant="outline">REFER500</Badge>
                  </div>
                  <Button>Invite</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">Happy Hour</h3>
                    <p className="text-gray-600 mb-3">
                      Enhanced odds on selected matches every day from 6 PM to 9 PM. Don't miss out!
                    </p>
                    <Badge variant="outline">HAPPYHOUR</Badge>
                  </div>
                  <Button>View Matches</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Terms */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-3">Terms & Conditions</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>All bonuses are subject to wagering requirements</li>
              <li>Minimum deposit of ₹500 required to claim bonuses</li>
              <li>Bonuses must be used within 30 days of claiming</li>
              <li>Standard terms and conditions apply</li>
              <li>18+ only. Please gamble responsibly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromotionsPage;