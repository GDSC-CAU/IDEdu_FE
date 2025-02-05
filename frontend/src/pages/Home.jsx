import logo from "../assets/logo.png";
import HalfScreen from "../components/HalfScreen";
import { useNavigate } from "react-router-dom";
import { useUser } from "../provider/UserContext";

function LoginSection() {
  const navigate = useNavigate();
  const { setIsTeacher } = useUser();

  const handleUserSelect = (isTeacher) => {
    setIsTeacher(isTeacher);
    navigate("/classroom");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <h1 className="text-3xl text-letter font-jetbrains p-4">I'm a ...</h1>
      <div className="flex flex-row gap-4 justify-center items-center">
        <span className="text-primary text-6xl font-jetbrains">{`{`}</span>
        <button
          className="text-letter text-4xl font-jetbrains hover:bg-primary hover:text-white"
          onClick={() => handleUserSelect(true)}
        >
          teacher
        </button>
        <span className="text-letter text-5xl font-jetbrains">{`||`}</span>
        <button
          className=" text-letter text-4xl font-jetbrains hover:bg-primary hover:text-white"
          onClick={() => handleUserSelect(false)}
        >
          student
        </button>
        <span className="text-primary text-6xl font-jetbrains">{`}`}</span>
      </div>
    </div>
  );
}

const Home = () => {
  return (
    <div className="grid grid-cols-2 w-full h-screen">
      <HalfScreen title="IDEdu.7dren">
        <img src={logo} alt="logo" className="w-1/2" />
      </HalfScreen>
      <HalfScreen title="login.7dren">
        <LoginSection />
      </HalfScreen>
    </div>
  );
};

export default Home;
