import { useState } from "react";
import { useUser } from "../../provider/UserContext";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

export default function Login({ onBack, onSignUp }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { isTeacher } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/classroom");
  };

  return (
    <div className="flex flex-col items-center justify-center h-2/3 w-2/3 gap-4 relative">
      <BackButton onClick={onBack} />
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
