User (Buyer)
{
  "id": "user_123",
  "name": "Jai Hanuman Traders",
  "address": "Bankata Bazar, UP",
  "phone": "7011571659",
  "userType": "buyer",
  "gstn": "09ABCDE1234F1Z5",
  "createdAt": "2025-05-14T10:00:00Z"
}

User (seller)
{
  "id": "user_456",
  "name": "Dharam Traders",
  "address": "Noida, UP",
  "phone": "988345756",
  "userType": "seller",
  "createdAt": "2025-05-14T09:00:00Z"
}


Order
{
  "id": "order_0018",
  "orderId": "OD-0018",
  "buyerId": "user_123",
  "sellerId": "user_456",
  "created_at": "2025-05-14T17:21:59.455Z",

  "inputs": {
    "ratePerQuantal": 2500,
    "poldariRate": 4,
    "dharmKata": "DharmKata B",
    "baadWajan": 500,
    "finalWeight": 2487.5,
    "totalWeight": 2500,
    "totalbaadWajan": 12.5,
    "totalItem": "66",
    "totalPoldar": "2",
    "itemType": "Sarso",
    "quality": "Avg",
    "warehouse": "Katya"
  },

  "paymentIds": ["payment_001", "payment_002"]
}

Payments Table
{
  "id": "payment_0018",
  "orderId": "order_0018",
  "finalPrice": 61923.5,
  "paymentAmount": 30000,
  "dueAmount": 31923.5,
  "paymentStatus": "Pending",
  "createdAt": "2025-05-14T18:00:00Z",
  "history": [
    {
      "id": "history_001",
      "paymentId": "payment_0018",
      "amount": 15000,
      "date": "2025-05-14T10:30:00Z",
      "method": "cash"
    },
    {
      "id": "history_002",
      "paymentId": "payment_0018",
      "amount": 15000,
      "date": "2025-05-14T17:45:00Z",
      "method": "bank"
    }
  ]
}


