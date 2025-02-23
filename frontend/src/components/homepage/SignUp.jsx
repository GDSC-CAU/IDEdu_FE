import { useState } from "react";
import { useUser } from "../../provider/UserContext";
import BackButton from "./BackButton";

export default function SignUp({ onBack, onSignUp }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isTeacher } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-2/3 w-2/3 gap-4 relative">
      <BackButton onClick={onBack} />
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
