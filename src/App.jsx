import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './features/auth/AuthContext';

function App() {
  
  // Remove localStorage user seeding, Firebase Auth will handle users

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;