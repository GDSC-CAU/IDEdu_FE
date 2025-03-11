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
        onBack={() => setView("loginSection")} // 뒤로가면 메인 화면으로
        onSignUp={() => setView("signUp")} // 회원가입 버튼 클릭 시 회원가입 화면으로
      />
    ),
    signUp: (
      <SignUp
        onBack={() => setView("login")} // 뒤로가면 로그인 화면
        onSignUp={() => setView("loginSection")} // 회원가입 성공 시 메인 화면으로
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
