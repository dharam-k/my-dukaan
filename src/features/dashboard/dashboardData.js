// dashboardData.js  

export const overviewStats = [  
  { label: "Total Purchases", value: 24 },  
  { label: "Completed Payments", value: 21 },  
  { label: "Pending Payments", value: 3 },  
  { label: "Pending Orders", value: 5 },  
];  

export const orderAnalyticsStats = [  
  { label: "Pending Orders (₹ Lakhs)", value: 12 },  
  { label: "Completed Orders (₹ Lakhs)", value: 68 },  
];  

export const inventoryStats = [  
  { label: "Total Stock in Warehouse", value: 120000 },  
  { label: "Total Warehouses", value: 6 },  
];  

export const sellersMillsStats = [  
  { label: "Total Sellers", value: 15 },  
  { label: "Total Mills", value: 4 },  
];  

export const recentOrders = [  
  {  
    orderId: "ORD-1001",  
    sellerName: "Seller A",  
    totalWeight: "1500 kg",  
    totalItems: 30,  
    finalPrice: "₹ 1,20,000",  
    paymentStatus: "Completed",  
    purchaseDate: "8th June 2024",  
  },  
  {  
    orderId: "ORD-1002",  
    sellerName: "Seller B",  
    totalWeight: "800 kg",  
    totalItems: 15,  
    finalPrice: "₹ 60,000",  
    paymentStatus: "Completed",  
    purchaseDate: "10th Dec 2024",  
  },  
  {  
    orderId: "ORD-1003",  
    sellerName: "Seller C",  
    totalWeight: "2000 kg",  
    totalItems: 40,  
    finalPrice: "₹ 1,50,000",  
    paymentStatus: "Pending",  
    purchaseDate: "15th Jan 2025",  
  },  
];

export const pendingPayments = [  
  {  
    paymentId: "PAY-101",  
    orderId: "ORD-2001",  
    sellerName: "Seller X",  
    totalAmount: "₹ 50,000",  
    paidAmount: "₹ 25,000",  
    amountDue: "₹ 25,000",  
    lastPaymentDate: "20th May 2025",
  },  
  {  
    paymentId: "PAY-102",  
    orderId: "ORD-2002",  
    sellerName: "Seller Y",  
    totalAmount: "₹ 75,000",  
    paidAmount: "₹ 25,000",  
    amountDue: "₹ 50,000",  
    lastPaymentDate: "20th May 2025",
  },  
];