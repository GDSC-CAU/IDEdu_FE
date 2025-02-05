import HalfScreen from "../components/HalfScreen";
import { useNavigate } from "react-router-dom";

const TeacherIDE = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col h-10 items-start justify-center bg-primary text-white border-b border-white">
        <span
          className="flex items-center gap-4 py-2 px-5 cursor-pointer"
          onClick={() => navigate(`/classroom`)}
        >
          <span>{"<"}</span>
          <span>강의실로 돌아가기</span>
        </span>
      </div>
      <div className="grid grid-cols-[3fr_1fr] w-full h-full">
        <HalfScreen title="Teacher">{/* 코드 작성 영역 */}</HalfScreen>
      </div>
    </div>
  );
};

export default TeacherIDE;
