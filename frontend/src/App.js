import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { UserProvider } from "context/UserContext";

// pages
import Home from "./pages/Home";
import Match from "pages/Match";
import Ranking from "./pages/Ranking";
import Prediction from "./pages/Prediction";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "components/Home/Header";
import RegisterProfile from "pages/RegisterProfile";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserProvider>

  );
}

const AppContent = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register-profile" element={<RegisterProfile />} />
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/prediction" element={<Prediction />} />
      </Routes>
    </>


  )
}

export default App;
