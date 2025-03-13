import Board from "../components/Board";
import AddButton from "../components/AddButton";
import { useNavigate, useParams } from "react-router-dom";
import StudentList from "../components/classroom/StudentList";
import NoticeList from "../components/classroom/NoticeList";
import goback from "../assets/goback.png";
import logout from "../assets/logout.png";
import { useClassroom } from "../hooks/useClassroomData";

const Classroom = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const {
    className,
    teacherIdeId,
    studentIdeId,
    notices,
    assignments,
    buildHistories,
    students,
    loading,
    error,
    isTeacher,
  } = useClassroom(courseId);

  const handleClassStart = () => {
    if (isTeacher) {
      navigate(`/classroom/${courseId}/teacher-ide`);
    } else {
      navigate(`/classroom/${courseId}/student-ide`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen w-full p-20 gap-8">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="w-7 h-9">
            <img src={goback} alt="goback" className="w-6" />
          </button>
          <div className="flex justify-center text-3xl font-bold text-primary">
            {className}
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <button
            className="dark-btn bg-primary text-xl py-3 px-10"
            onClick={handleClassStart}
          >
            {isTeacher ? "수업하기" : "수업듣기"}
          </button>
          <button className="w-7 h-9" onClick={handleLogout}>
            <img src={logout} alt="logout" className="w-6" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-4 h-full">
        {/* 왼쪽: 공지사항, 과제함, 빌드 히스토리 */}
        <div className="grid grid-cols-2 grid-rows-[2fr_1fr] gap-4 h-full">
          {/* 공지사항 */}
          <Board title="공지사항" className="flex flex-col justify-between">
            <div className="flex-1">
              <NoticeList notices={notices} />
            </div>
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
          <StudentList students={students} />
        </Board>
      </div>
    </div>
  );
};

export default Classroom;
