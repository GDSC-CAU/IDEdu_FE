import { useState } from "react";
import logo from "../assets/logo.png";
import HalfScreen from "../components/HalfScreen";
import { useUser } from "../provider/UserContext";
import LoginSection from "../components/homepage/LoginSection";
import Login from "../components/homepage/Login";
import SignUp from "../components/homepage/SignUp";

const Home = () => {
  const { setIsTeacher } = useUser();
  const [view, setView] = useState("loginSection");

  const handleUserSelect = (isTeacher) => {
    setIsTeacher(isTeacher);
    setView("login");
  };

  const viewMap = {
    loginSection: <LoginSection handleUserSelect={handleUserSelect} />,
    login: (
      <Login
        onBack={() => setView("loginSection")}
        onSignUp={() => setView("signUp")}
      />
    ),
    signUp: (
      <SignUp
        onBack={() => setView("login")}
        onSignUp={() => setView("loginSection")}
      />
    ),
  };

  return (
    <div className="grid grid-cols-2 w-full h-screen">
      <HalfScreen title="IDEdu.7dren">
        <img src={logo} alt="logo" className="w-1/2" />
      </HalfScreen>
      <HalfScreen title="login.7dren">{viewMap[view]}</HalfScreen>
    </div>
  );
};

export default Home;
