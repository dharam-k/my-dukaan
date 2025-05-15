import './App.css';
import { BrowserRouter as Router } from "react-router-dom";  
import { users } from './utils/constants';
import AppRoutes from './routes/AppRoutes';

function App() {

  const seedDummyUsers = () => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  seedDummyUsers();

  return (
    <Router>
        <AppRoutes/>
    </Router>
  );
}

export default App;
