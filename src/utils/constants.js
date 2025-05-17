import {  
  FaTag,  
  FaMoneyBillWave,  
  FaRupeeSign, 
  FaWarehouse,  
} from "react-icons/fa"; 

export const inputUnitsMap = {  
  ratePerQuantal: "₹/qntl",  
  poldariRate: "₹",  
  dharmKata: "",  
  totalWeight: "kg",  
  baadWajan: "gm/qntl",  
  totalbaadWajan: "kg",  
  finalWeight: "kg",  
  totalItem: "pcs",  
  totalPoldar: "persons",  
  itemType: "",  
  quality: "",  
  warehouse: "",  
}; 

export const calculationIconsMap = {  
  totalPolidari: FaMoneyBillWave,  
  perHeadPoldari: FaMoneyBillWave,  
  totalPrice: FaRupeeSign,  
  finalPrice: FaRupeeSign,  
};  

export const inputIconsMap = {  
  ratePerQuantal: FaRupeeSign,  
  poldariRate: FaMoneyBillWave,  
  dharmKata: FaTag,  
  totalWeight: FaTag,  
  totalItem: FaTag,  
  totalPoldar: FaTag,  
  itemType: FaTag,  
  quality: FaTag,  
  warehouse: FaWarehouse,  
};  


export const users = [
        {
          id: "user_001",
          name: "Jai Hanuman Traders",
          address: "Bankata Bazar, UP",
          phone: "1234567890",
          password: "1234",
          userType: "buyer",
          gstn: "09AABCU9603R1Z1",
          isActive: true,
          loginActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: "user_002",
          name: "Jai Shri Traders",
          address: "Noida, UP",
          phone: "07011571659",
          password: "1234",
          userType: "seller",
          isActive: true,
          loginActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: "user_003",
          name: "Sample Buyer",
          address: "Lucknow, UP",
          phone: "1234567890",
          password: "1234",
          userType: "buyer",
          isActive: false,
          loginActive: false,
          gstn: "09AAACU9603R1Z2",
          createdAt: new Date().toISOString()
        }
      ];


// Hindi dictionary for known English item types
export const hindiDictionary = {
  "Mansoori Dhaan": "मंसूरीधान",
  "Mota Dhaan": "मोटाधान",
  "Sambha Dhaan": "संभांधान",
  "Gehu": "गेहूँ",
  "Makka": "मक्का",
  "Sarso": "सरसों",
  "Rice": "चावल",
};