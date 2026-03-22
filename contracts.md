# Rudrabet API Contracts

## Authentication APIs

### POST /api/auth/register
**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)"
}
```
**Response:**
```json
{
  "user": { ...user object },
  "access_token": "string",
  "token_type": "bearer"
}
```

### POST /api/auth/login
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "user": { ...user object },
  "access_token": "string",
  "token_type": "bearer"
}
```

### GET /api/auth/me
**Headers:** `Authorization: Bearer {token}`
**Response:** User object

## Betting APIs

### POST /api/bets/
**Headers:** `Authorization: Bearer {token}`
**Request:**
```json
{
  "match_id": "string",
  "selection": "string",
  "odds": number,
  "stake": number,
  "bet_type": "single|accumulator|system",
  "home_team": "string",
  "away_team": "string",
  "league": "string",
  "sport": "string"
}
```

### GET /api/bets/my-bets
**Headers:** `Authorization: Bearer {token}`
**Query params:** `status`, `limit`

### GET /api/bets/stats/summary
**Headers:** `Authorization: Bearer {token}`

## Transaction APIs

### GET /api/transactions/payment-settings
**Response:** Payment configuration with QR code URL

### POST /api/transactions/deposit
**Headers:** `Authorization: Bearer {token}`
**Request:**
```json
{
  "amount": number,
  "method": "string (default: QR Code)"
}
```
**Response:**
```json
{
  "transaction_id": "string",
  "reference_id": "string",
  "qr_code_url": "string",
  "upi_id": "string",
  "amount": number
}
```

### POST /api/transactions/upload-screenshot/{transaction_id}
**Headers:** `Authorization: Bearer {token}`
**Form Data:** `file: image`

### POST /api/transactions/withdraw
**Headers:** `Authorization: Bearer {token}`
**Request:**
```json
{
  "amount": number,
  "method": "UPI|Bank Transfer",
  "upi_id": "string (optional)",
  "bank_account": "string (optional)"
}
```

### GET /api/transactions/my-transactions
**Headers:** `Authorization: Bearer {token}`
**Query params:** `type`, `status`, `limit`

## Admin APIs

### POST /api/admin/login
**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### GET /api/admin/stats
**Headers:** `Authorization: Bearer {admin_token}`

### GET /api/admin/users
**Headers:** `Authorization: Bearer {admin_token}`
**Query params:** `status`, `search`, `limit`, `skip`

### POST /api/admin/bets/settle
**Headers:** `Authorization: Bearer {admin_token}`
**Request:**
```json
{
  "bet_id": "string",
  "result": "won|lost",
  "admin_notes": "string (optional)"
}
```

### POST /api/admin/transactions/action
**Headers:** `Authorization: Bearer {admin_token}`
**Request:**
```json
{
  "transaction_id": "string",
  "action": "approve|reject",
  "admin_notes": "string (optional)"
}
```

## Frontend Integration Plan

### Mock Data Replacement
1. **Authentication**: Replace localStorage mock login with actual API calls
2. **Betting**: Use real API for bet placement and history
3. **Transactions**: Integrate deposit/withdrawal with QR code display
4. **Admin**: Connect all admin operations to backend APIs

### Context Updates Needed
- BettingContext: Add API integration for auth, bets, wallet
- AdminContext: Add API integration for admin operations
- Add axios interceptors for auth token management
- Add error handling and toast notifications for API errors

### Payment Flow
1. User clicks deposit → Call `/api/transactions/deposit`
2. Show QR code modal with returned `qr_code_url`
3. User uploads screenshot → Call `/api/transactions/upload-screenshot`
4. Admin approves → Balance credited automatically
