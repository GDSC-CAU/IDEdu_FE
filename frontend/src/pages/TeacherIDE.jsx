import HalfScreen from "../components/HalfScreen";
import { useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import goback from "../assets/goback-w.png";

const TeacherIDE = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col h-10 items-start justify-center bg-primary text-white border-b border-white">
        <span
          className="flex items-center gap-4 py-2 px-5 cursor-pointer"
          onClick={() => navigate(`/classroom`)}
        >
          <img src={goback} alt="goback" className="w-4" />
          <span>강의실로 돌아가기</span>
        </span>
      </div>
      <div className="grid grid-cols-[3fr_1fr] w-full h-full">
        <HalfScreen title="Teacher">
          <CodeEditor />
        </HalfScreen>
        <div className="flex flex-col items-center p-5 gap-3">
          <button className="bg-secondary p-2 w-4/5 hover:bg-primary hover:text-white">
            수업 시작하기
          </button>
          <div className="text-center text-sm text-gray-400">
            수업 시작 전입니다. <br /> 화면을 공유하려면 수업을 시작하세요.
          </div>
          <div className="flex flex-row justify-between items-center w-full mt-2">
            <h1 className="text-lg">학생명단</h1>
            <span className="mr-4">도움</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherIDE;
