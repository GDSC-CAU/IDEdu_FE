import { useState } from "react";
import logo from "../assets/logo.png";
import HalfScreen from "../components/HalfScreen";
import { useNavigate } from "react-router-dom";
import { useUser } from "../provider/UserContext";

function LoginSection({ handleUserSelect }) {
  // const navigate = useNavigate();
  // const { setIsTeacher } = useUser();

  // const handleUserSelect = (isTeacher) => {
  //   setIsTeacher(isTeacher);
  //   //navigate("/classroom");
  // };

  return (
    <div className="flex flex-col items-center justify-center h-2/3 w-2/3 gap-4">
      <h1 className="text-3xl text-letter font-jetbrains p-4">I'm a ...</h1>
      <div className="flex flex-row gap-4 justify-center items-center">
        <span className="text-primary text-6xl font-jetbrains">{`{`}</span>
        <button className="main-btn" onClick={() => handleUserSelect(true)}>
          teacher
        </button>
        <span className="text-letter text-5xl font-jetbrains">{`||`}</span>
        <button className="main-btn" onClick={() => handleUserSelect(false)}>
          student
        </button>
        <span className="text-primary text-6xl font-jetbrains">{`}`}</span>
      </div>
    </div>
  );
}

function Login({ onBack, onSignUp }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { isTeacher } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/classroom");
  };

  return (
    <div className="flex flex-col items-center justify-center h-2/3 w-2/3 gap-4 relative">
      <button
        onClick={onBack}
        className="absolute top-0 left-0 text-primary text-xl hover:text-gray-600 flex items-center p-2"
      >
        <span>{"<<"}</span>
      </button>
      <h1 className="text-5xl text-white font-jetbrains mb-8 bg-primary px-2 py-1">
        {isTeacher ? "Teacher" : "Student"}
      </h1>
      <input
        type="text"
        placeholder="Enter ID"
        className="input-field"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-row gap-4 justify-center items-center mt-8">
        <span className="text-primary text-5xl font-jetbrains">{`{`}</span>
        <button className="main-btn" onClick={handleLogin}>
          Login
        </button>
        <span className="text-primary text-5xl font-jetbrains">{`}`}</span>
      </div>
      <button
        className="text-gray-500 text-2xl font-jetbrains hover:text-primary"
        onClick={onSignUp}
      >
        Sign up?
      </button>
    </div>
  );
}

function SignUp({ onBack, onSignUp }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isTeacher } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-2/3 w-2/3 gap-4 relative">
      <button
        onClick={onBack}
        className="absolute top-0 left-0 text-primary text-xl hover:text-gray-600 flex items-center p-2"
      >
        <span>{"<<"}</span>
      </button>
      <h1 className="text-5xl text-white font-jetbrains mb-8 bg-primary px-2 py-1">
        {isTeacher ? "Teacher" : "Student"}
      </h1>
      <input
        type="text"
        placeholder="Enter Name"
        className="input-field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter ID"
        className="input-field"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="input-field"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="flex flex-row gap-4 justify-center items-center mt-8">
        <span className="text-primary text-5xl font-jetbrains">{`{`}</span>
        <button className="main-btn" onClick={onSignUp}>
          Sign up
        </button>
        <span className="text-primary text-5xl font-jetbrains">{`}`}</span>
      </div>
    </div>
  );
}

const Home = () => {
  const { isTeacher, setIsTeacher } = useUser();
  const [view, setView] = useState("loginSection");

  const handleUserSelect = (isTeacher) => {
    setIsTeacher(isTeacher);
    setView("login");
  };

  return (
    <div className="grid grid-cols-2 w-full h-screen">
      <HalfScreen title="IDEdu.7dren">
        <img src={logo} alt="logo" className="w-1/2" />
      </HalfScreen>
      <HalfScreen title="login.7dren">
        {view === "loginSection" && (
          <LoginSection handleUserSelect={handleUserSelect} />
        )}
        {view === "login" && (
          <Login
            onBack={() => setView("loginSection")}
            onSignUp={() => setView("signUp")}
          />
        )}
        {view === "signUp" && (
          <SignUp
            onBack={() => setView("login")}
            onSignUp={() => setView("loginSection")}
          />
        )}
      </HalfScreen>
    </div>
  );
};

export default Home;
