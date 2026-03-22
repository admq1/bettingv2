// Mock data for Rudrabet betting platform

export const sportsData = [
  { id: 1, name: 'Football', icon: '⚽', matches: 245, live: 12 },
  { id: 2, name: 'Basketball', icon: '🏀', matches: 89, live: 5 },
  { id: 3, name: 'Tennis', icon: '🎾', matches: 156, live: 8 },
  { id: 4, name: 'Cricket', icon: '🏏', matches: 67, live: 3 },
  { id: 5, name: 'Ice Hockey', icon: '🏒', matches: 34, live: 2 },
  { id: 6, name: 'Volleyball', icon: '🏐', matches: 45, live: 4 },
  { id: 7, name: 'Table Tennis', icon: '🏓', matches: 78, live: 6 },
  { id: 8, name: 'Boxing', icon: '🥊', matches: 23, live: 1 },
];

export const liveMatches = [
  {
    id: 1,
    sport: 'Football',
    league: 'Premier League',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 1,
    awayScore: 2,
    time: "67'",
    odds: {
      home: 2.85,
      draw: 3.20,
      away: 1.95
    }
  },
  {
    id: 2,
    sport: 'Basketball',
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeScore: 89,
    awayScore: 92,
    time: "Q3 8:45",
    odds: {
      home: 1.75,
      spread: 2.05,
      away: 2.15
    }
  },
  {
    id: 3,
    sport: 'Tennis',
    league: 'ATP',
    homeTeam: 'Djokovic',
    awayTeam: 'Nadal',
    homeScore: 2,
    awayScore: 1,
    time: 'Set 3',
    odds: {
      home: 1.45,
      away: 2.65
    }
  }
];

export const upcomingMatches = [
  {
    id: 4,
    sport: 'Football',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: '2025-03-22T18:00:00',
    odds: {
      home: 2.10,
      draw: 3.40,
      away: 3.25
    }
  },
  {
    id: 5,
    sport: 'Cricket',
    league: 'IPL',
    homeTeam: 'Mumbai Indians',
    awayTeam: 'Chennai Super Kings',
    startTime: '2025-03-22T14:30:00',
    odds: {
      home: 1.85,
      away: 1.95
    }
  },
  {
    id: 6,
    sport: 'Basketball',
    league: 'NBA',
    homeTeam: 'Celtics',
    awayTeam: 'Heat',
    startTime: '2025-03-22T20:00:00',
    odds: {
      home: 1.55,
      spread: 1.90,
      away: 2.40
    }
  }
];

export const casinoGames = [
  { id: 1, name: 'Crazy Time', category: 'Live Casino', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop' },
  { id: 2, name: 'Lightning Roulette', category: 'Live Casino', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1531419292351-4ed9c0d7f155?w=400&h=300&fit=crop' },
  { id: 3, name: 'Book of Dead', category: 'Slots', provider: 'Play\'n GO', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop' },
  { id: 4, name: 'Blackjack VIP', category: 'Live Casino', provider: 'Pragmatic', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop' },
  { id: 5, name: 'Mega Moolah', category: 'Slots', provider: 'Microgaming', image: 'https://images.unsplash.com/photo-1529310399831-ed472b81d589?w=400&h=300&fit=crop' },
  { id: 6, name: 'Baccarat', category: 'Live Casino', provider: 'Evolution', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop' },
];

export const promotions = [
  {
    id: 1,
    title: 'Welcome Bonus',
    description: '100% First Deposit Bonus up to ₹25,000',
    image: 'https://images.unsplash.com/photo-1607290981296-b88d29fb4c50?w=800&h=400&fit=crop',
    code: 'WELCOME100'
  },
  {
    id: 2,
    title: 'Casino Cashback',
    description: 'Get 10% Cashback on Casino Losses',
    image: 'https://images.unsplash.com/photo-1556196828-d4dcb21e5325?w=800&h=400&fit=crop',
    code: 'CASHBACK10'
  },
  {
    id: 3,
    title: 'Free Bet Friday',
    description: 'Place 5 bets, get 1 Free Bet',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    code: 'FREEBET'
  }
];

export const userMockData = {
  id: 'user_123',
  username: 'player_demo',
  email: 'demo@rudrabet.com',
  balance: 15420.50,
  currency: '₹',
  verified: true,
  joinDate: '2024-12-15',
  totalBets: 156,
  totalWins: 87,
  winRate: 55.8
};

export const userBetsHistory = [
  {
    id: 'bet_001',
    date: '2025-03-21T15:30:00',
    type: 'Single',
    match: 'Man Utd vs Liverpool',
    selection: 'Liverpool Win',
    odds: 1.95,
    stake: 1000,
    potentialWin: 1950,
    status: 'won',
    settled: true
  },
  {
    id: 'bet_002',
    date: '2025-03-21T12:00:00',
    type: 'Accumulator',
    match: '3 Football Matches',
    selection: 'Multiple',
    odds: 5.45,
    stake: 500,
    potentialWin: 2725,
    status: 'pending',
    settled: false
  },
  {
    id: 'bet_003',
    date: '2025-03-20T18:45:00',
    type: 'Single',
    match: 'Lakers vs Warriors',
    selection: 'Warriors Win',
    odds: 2.15,
    stake: 750,
    potentialWin: 1612.50,
    status: 'lost',
    settled: true
  }
];

// Admin Mock Data
export const adminStats = {
  totalUsers: 15420,
  activeUsers: 3245,
  totalBets: 45678,
  activeBets: 1234,
  totalDeposits: 12500000,
  totalWithdrawals: 8750000,
  pendingWithdrawals: 125000,
  revenue: 3750000,
  todayBets: 2345,
  todayDeposits: 456000,
  todayWithdrawals: 234000
};

export const adminRecentUsers = [
  { id: 1, username: 'player001', email: 'player001@example.com', balance: 5420, status: 'active', joined: '2025-03-21' },
  { id: 2, username: 'betmaster', email: 'betmaster@example.com', balance: 12350, status: 'active', joined: '2025-03-20' },
  { id: 3, username: 'lucky_winner', email: 'lucky@example.com', balance: 45600, status: 'verified', joined: '2025-03-19' },
  { id: 4, username: 'sports_fan', email: 'sportsfan@example.com', balance: 2100, status: 'active', joined: '2025-03-21' },
  { id: 5, username: 'casino_king', email: 'casinoking@example.com', balance: 8900, status: 'verified', joined: '2025-03-18' },
];

export const adminRecentBets = [
  { id: 1, user: 'player001', match: 'Man Utd vs Liverpool', amount: 1000, odds: 1.95, potential: 1950, status: 'pending', time: '15 mins ago' },
  { id: 2, user: 'betmaster', match: 'Real Madrid vs Barcelona', amount: 2500, odds: 2.10, potential: 5250, status: 'won', time: '1 hour ago' },
  { id: 3, user: 'lucky_winner', match: 'Lakers vs Warriors', amount: 5000, odds: 1.75, potential: 8750, status: 'lost', time: '2 hours ago' },
  { id: 4, user: 'sports_fan', match: 'Djokovic vs Nadal', amount: 500, odds: 1.45, potential: 725, status: 'pending', time: '30 mins ago' },
  { id: 5, user: 'casino_king', match: 'Accumulator (3 matches)', amount: 1500, odds: 4.25, potential: 6375, status: 'pending', time: '45 mins ago' },
];

export const adminPaymentTransactions = [
  { id: 1, user: 'player001', type: 'deposit', method: 'UPI', amount: 5000, status: 'completed', time: '2025-03-21 14:30' },
  { id: 2, user: 'betmaster', type: 'withdrawal', method: 'Bank Transfer', amount: 15000, status: 'pending', time: '2025-03-21 13:45' },
  { id: 3, user: 'lucky_winner', type: 'deposit', method: 'QR Code', amount: 25000, status: 'completed', time: '2025-03-21 12:20' },
  { id: 4, user: 'sports_fan', type: 'deposit', method: 'Card', amount: 3000, status: 'completed', time: '2025-03-21 11:15' },
  { id: 5, user: 'casino_king', type: 'withdrawal', method: 'UPI', amount: 8500, status: 'processing', time: '2025-03-21 10:30' },
];