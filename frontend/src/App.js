import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Match from "./pages/Match";
import Ranking from "./pages/Ranking";
import Prediction from "./pages/Prediction";
import Content from "./components/Prediction/Content";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/prediction/:weekNumber" element={<Content />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
