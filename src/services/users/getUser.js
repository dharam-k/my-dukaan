  // Fetch user by ID from localStorage  
  
  export default function getUserById(userId){
    const users = JSON.parse(localStorage.getItem("users")) || [];  
    return users.find((user) => user.id === userId);  
  }