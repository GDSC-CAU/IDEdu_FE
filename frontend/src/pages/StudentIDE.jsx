import HalfScreen from "../components/HalfScreen";
import { useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import goback from "../assets/goback-w.png";

const StudentIDE = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col h-10 items-start justify-center bg-primary text-white border-b border-white">
        <span
          className="flex items-center gap-4 py-2 px-5 pr-16 cursor-pointer"
          onClick={() => navigate(`/classroom`)}
        >
          <img src={goback} alt="goback" className="w-4" />
          <span>강의실로 돌아가기</span>
        </span>
      </div>
      <div className="grid grid-cols-2 w-full h-full">
        <HalfScreen title="Teacher">
          수업이 아직 시작되지 않았습니다.
        </HalfScreen>
        <HalfScreen title="Student">
          <CodeEditor />
        </HalfScreen>
      </div>
    </div>
  );
};

export default StudentIDE;
