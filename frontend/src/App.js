import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "pages/Home";
import Match from "pages/Match";
import Ranking from "pages/Ranking";
import Prediction from "pages/Prediction";
import Content from "components/Prediction/Content";
import Login from "pages/Login";
import SignUp from "pages/SignUp";
import RegisterProfile from "pages/RegisterProfile";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "./firebase";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/prediction/:weekNumber" element={<Content />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register-profile" element={<RegisterProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
