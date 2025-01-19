import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Ranking from "./pages/Ranking";
import Prediction from "./pages/Prediction";
import Content from "./components/Prediction/Content";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "./firebase";
import { useEffect, useState } from "react";
import Header from "components/Home/Header";

const App = () => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const login = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => login();
  }, [auth]);

  // 로그아웃 처리
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);  // 로그아웃 후 상태 초기화
      })
      .catch((error) => {
        console.error("로그아웃 실패", error);
      });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/prediction/:weekNumber" element={<Content />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
