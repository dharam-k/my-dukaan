  export const calculateOrderValues = (inputs) => {  
    if (!inputs) return null;  

    const ratePerQuantal = parseFloat(inputs.ratePerQuantal) || 0;  
    const poldariRate = parseFloat(inputs.poldariRate) || 0;  
    const finalWeight = parseFloat(inputs.finalWeight) || 0;  
    const totalPoldar = parseFloat(inputs.totalPoldar) || 1; 
    const totalItems = inputs.totalItem;

    const totalPolidari = (totalItems * poldariRate);  
    const perHeadPoldari = totalPoldar > 0 ? totalPolidari / totalPoldar : 0;  
    const totalPrice = (finalWeight * ratePerQuantal) / 100;  
    const finalPrice = totalPrice - totalPolidari;  

    return {  
      totalPolidari,  
      perHeadPoldari,  
      totalPrice,  
      finalPrice,  
    };  
  }