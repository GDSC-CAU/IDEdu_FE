import { useState } from "react";
import { useUser } from "../../provider/UserContext";
import BackButton from "./BackButton";

export default function SignUp({ onBack, onSignUp }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isTeacher } = useUser();

  const handleSignUp = async () => {
    console.log("입력된 값:", username, id, password, confirmPassword);
    if (!username || !id || !password || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    let alertMessage = "";
    if (password.length < 8) {
      alertMessage += "비밀번호는 8자 이상이어야 합니다.\n";
    }
    if (username.length < 3) {
      alertMessage += "이름은 3자 이상이어야 합니다.\n";
    }
    if (id.length < 5) {
      alertMessage += "아이디는 5자 이상이어야 합니다.\n";
    }
    if (password !== confirmPassword) {
      alertMessage += "비밀번호가 일치하지 않습니다.\n";
    }
    if (alertMessage) {
      alert(alertMessage);
      return;
    }
    try {
      const requestData = {
        username: username,
        userId: id,
        password: password,
        memberType: isTeacher ? "TEACHER" : "STUDENT",
      };
      console.log("요청 데이터:", requestData);

      const response = await fetch("http://15.165.155.115:8080/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      console.log("응답 상태:", response.status);

      if (!response.ok) {
        alert("회원가입 실패: 데이터 패치 실패");
        return;
      }
      const data = await response.json();
      console.log("회원가입 성공: ", data);
      onSignUp();
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-2/3 w-2/3 gap-4 relative">
      <BackButton onClick={onBack} />
      <h1 className="text-3xl text-white font-jetbrains mb-8 bg-primary px-2 py-1">
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
        <span className="text-primary text-4xl font-jetbrains">{`{`}</span>
        <button className="main-btn" onClick={handleSignUp}>
          Sign up
        </button>
        <span className="text-primary text-4xl font-jetbrains">{`}`}</span>
      </div>
    </div>
  );
}
