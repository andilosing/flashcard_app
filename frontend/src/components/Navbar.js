import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../provider/flashcards";
import { API_ENDPOINT } from "../api/index";

function NavBar() {
  const { isLoggedIn, onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/logout`, {
        method: "POST",
        credentials: "include",
      });

      console.log("Logout frontend")
  
      if (response.status === 200) {
        onLogout();
        sessionStorage.clear();
        
        navigate("/login");
      } else if (response.status === 401){
        console.error("Du bist nicht eingeloggt")
        onLogout()
        navigate("/login")
      }
       else {
        console.error("Fehler beim Ausloggen:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Fehler beim Ausloggen:", error);
    }
  };
  

  return (
    <nav className="navbar">
      {isLoggedIn ? (
        <button className="logout-btn" onClick={handleLogOut}>Logout</button>
      ) : (
        <Link className="navbar-links" to="/login">Login</Link>
      )}
      <Link className="navbar-links" to="/flashcards">Flashcards</Link>
      <Link className="navbar-links" to="/learningstack">Learning Stack</Link>
      
    </nav>
  );
}

export default NavBar;
