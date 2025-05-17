
/*
useSearchParams (Buyer)
{
  "id": "user_123",
  "name": "Jai Hanuman Traders",
  "address": "Bankata Bazar, UP",
  "phone": "7011571659",
  "userType": "buyer",
  "gstn": "09ABCDE1234F1Z5",
  "createdAt": "2025-05-14T10:00:00Z"
}

Users (seller)
{
  "id": "user_456",
  "name": "Dharam Traders",
  "address": "Noida, UP",
  "phone": "988345756",
  "userType": "seller",
  "createdAt": "2025-05-14T09:00:00Z"
}

Orders
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


payments
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


logs 
----
{
  "id": "log_0001",
  "userId": "user_123",                  // The user who performed the action
  "action": "CREATE_ORDER",              // Enum: e.g., CREATE_USER, LOGIN, CREATE_ORDER, MAKE_PAYMENT, UPDATE_PAYMENT, etc.
  "targetType": "order",                 // Could be: user, order, payment, etc.
  "targetId": "order_0018",              // ID of the item affected
  "timestamp": "2025-05-14T18:10:00Z",   // When the action occurred
  "meta": {                              // Optional: detailed info about what happened
    "orderId": "OD-0018",
    "amount": 30000,
    "paymentMethod": "cash"
  },
  "description": "Created new order with ID OD-0018 for buyer Jai Hanuman Traders"
}


Example Actions You Might Log:
action	targetType	description example
LOGIN	user	User logged in
CREATE_USER	user	Created seller Jai Shri Traders
CREATE_ORDER	order	Created new order OD-0018
MAKE_PAYMENT	payment	Received payment of ₹15,000 for order OD-0018
UPDATE_PAYMENT	payment	Updated payment from ₹30,000 to ₹40,000 for order OD-0018
DELETE_ORDER	order	Order OD-0018 deleted by admin


Truck Loading data

{
    "truckEntry": {
        "truckNumber": "UP16AW2345",
        "itemType": "gehu",
        "loadingDate": "2025-05-16",
        "billNo": "BILL-1747426031580"
    },
    "truckDetails": {
        "driverName": "Dharam Kumar",
        "mobile": "4444444444",
        "address": "Noida"
    },
    "millDetails": {
        "id": "2",
        "name": "Golden Grain Mill",
        "mobile": "9123456780",
        "address": "New Market, City",
        "gstn": "",
        "ratePerQuintal": "2500"
    },
    "stockLoadingOption": "both",
    "warehouseData": {
        "totalWeight": "10000",
        "totalItems": "230",
        "totalPoldar": "4",
        "poldariRate": "4",
        "dharmakata": "Dharmakata A",
        "warehouse": "kateya"
    },
    "sellersData": [
        {
            "id": "",
            "name": "dharam ",
            "ratePerQuintal": "2098",
            "totalWeight": "5000",
            "totalItems": "120",
            "totalPoldar": "4",
            "poldariRate": "4",
            "baadwjanPerQ": "500",
            "dharmakataOrShop": "Dharmakata A",
            "mobile": "636363663"
        },
        {
            "id": "",
            "name": "vahid",
            "ratePerQuintal": "2200",
            "totalWeight": "3000",
            "totalItems": "50",
            "totalPoldar": "4",
            "poldariRate": "4",
            "baadwjanPerQ": "500",
            "dharmakataOrShop": "Dharmakata A",
            "mobile": "66466464646"
        }
    ],
    "sellerCalcData": [
        {
            "id": "",
            "name": "dharam ",
            "ratePerQuintal": "2098",
            "totalWeight": "5000",
            "totalItems": "120",
            "totalPoldar": "4",
            "poldariRate": "4",
            "baadwjanPerQ": "500",
            "dharmakataOrShop": "Dharmakata A",
            "mobile": "636363663",
            "totalPoldari": 480,
            "perHeadPoldari": 120,
            "totalBaadwjan": 25,
            "finalWeight": 4975,
            "totalPrice": 104375.5,
            "finalPrice": 103895.5
        },
        {
            "id": "",
            "name": "vahid",
            "ratePerQuintal": "2200",
            "totalWeight": "3000",
            "totalItems": "50",
            "totalPoldar": "4",
            "poldariRate": "4",
            "baadwjanPerQ": "500",
            "dharmakataOrShop": "Dharmakata A",
            "mobile": "66466464646",
            "totalPoldari": 200,
            "perHeadPoldari": 50,
            "totalBaadwjan": 15,
            "finalWeight": 2985,
            "totalPrice": 65670,
            "finalPrice": 65470
        }
    ]
}








*/