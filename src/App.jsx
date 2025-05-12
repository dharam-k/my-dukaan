import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";  
import BuyerDashboard from './features/dashboard/BuyerDashboard';
import LoginForm from './components/auth/LoginForm';

function App() {

  const seedDummyUsers = () => {  
    if (!localStorage.getItem("dummyUsers")) {  
      const dummyUsers = [  
        { mobileOrEmail: "user1@example.com", password: "password1" },  
        { mobileOrEmail: "user2@example.com", password: "password2" },  
        { mobileOrEmail: "1234567890", password: "pass1234" },  
      ];  
      localStorage.setItem("dummyUsers", JSON.stringify(dummyUsers));  
    }  
  };  
  seedDummyUsers();

  return (
    <Router>  
      <Routes>  
        <Route path="/login" element={<LoginForm />} />  
        <Route path="/dashboard" element={<BuyerDashboard />} />  
        <Route path="*" element={<Navigate to="/login" replace />} />  
      </Routes>  
    </Router>  
  )
}

export default App
