import './App.css';
import { useReducer, useEffect } from "react"
import Flashcards from "./components/flashcards"
import LearningStack from "./components/learningStack"
import {
  AuthContext,
  FlashcardsContext,
  FlashcardsInitialState,
  FlashcardsReducer
} from "./provider/flashcards"
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedIsLoggedIn = sessionStorage.getItem("isLoggedIn");
    return savedIsLoggedIn ? JSON.parse(savedIsLoggedIn) : false;
  });

  const [state, dispatch] = useReducer(
    FlashcardsReducer,
    FlashcardsInitialState
  )

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    dispatch({ type: "RESET" }); dispatch({ type: "RESET" }); 
  };

  return (
    <Router>
      <div className="App">
        <AuthContext.Provider value={{ isLoggedIn, onLogin: handleLogin, onLogout: handleLogout }}>
          <h1>My Flashcards</h1>
          <NavBar />
          <FlashcardsContext.Provider value={{ state, dispatch }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/learningstack" element={<LearningStack />} />
            </Routes>
          </FlashcardsContext.Provider>
        </AuthContext.Provider>
      </div>
    </Router>
  );
  
}

export default App;
