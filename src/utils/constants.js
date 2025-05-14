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