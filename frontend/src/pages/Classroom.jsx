import Board from "../components/Board";
import AddButton from "../components/AddButton";
import { useUser } from "../provider/UserContext";
import { useNavigate } from "react-router-dom";
import StudentList from "../components/StudentList";

const Classroom = () => {
  const { isTeacher } = useUser();
  const navigate = useNavigate();

  const handleClassStart = () => {
    if (isTeacher) {
      navigate("/teacher-ide");
    } else {
      navigate("/student-ide");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full p-20 gap-8">
      <div className="flex flex-row w-full px-10 items-center justify-between">
        <div className="flex justify-center text-3xl font-bold text-primary">
          강의실 1
        </div>
        <button
          className="flex justify-center bg-primary text-2xl py-3 px-10 text-white rounded-lg border border-primary hover:bg-secondary hover:text-primary"
          onClick={handleClassStart}
        >
          {isTeacher ? "수업하기" : "수업듣기"}
        </button>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-4 h-full">
        {/* 왼쪽: 공지사항, 과제함, 빌드 히스토리 */}
        <div className="grid grid-cols-2 grid-rows-[2fr_1fr] gap-4 h-full">
          {/* 공지사항 */}
          <Board title="공지사항" className="flex flex-col justify-between">
            <div className="flex-1">{/* 공지사항 내용 */}</div>
            {isTeacher && <AddButton></AddButton>}
          </Board>

          {/* 과제함 */}
          <Board title="과제함" className="flex flex-col justify-between">
            <div className="flex-1">{/* 과제함 내용 */}</div>
            {isTeacher && <AddButton></AddButton>}
          </Board>

          {/* 빌드 히스토리 */}
          <Board title="빌드 히스토리" className="col-span-2">
            <div className="flex-1">{/* 빌드 히스토리 내용 */}</div>
          </Board>
        </div>

        {/* 오른쪽: 학생 명단 */}
        <Board title="학생 명단">
          <StudentList />
        </Board>
      </div>
    </div>
  );
};

export default Classroom;
