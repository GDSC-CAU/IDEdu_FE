import Board from "../components/Board";
import { useNavigate, useParams } from "react-router-dom";
import StudentList from "../components/classroom/StudentList";
import NoticeList from "../components/classroom/NoticeList";
import goback from "../assets/goback.png";
import logout from "../assets/logout.png";
import { useClassroom } from "../hooks/useClassroomData";
import AssignmentList from "../components/classroom/AssignmentList";
import BuildHistory from "../components/classroom/BuildHistory";

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
    <div className="flex flex-col h-screen w-full">
      {/* 상단 헤더 */}
      <div className="flex flex-row w-full items-center justify-between p-8">
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

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-8 pb-8 min-h-0">
        <div className="grid grid-cols-[3fr_1fr] gap-4 h-full">
          {/* 왼쪽: 공지사항, 과제함, 빌드 히스토리 */}
          <div className="flex flex-col gap-4 h-full min-h-0">
            <div className="grid grid-cols-2 gap-4 flex-[3] min-h-0">
              <Board title="공지사항" isTeacher={isTeacher}>
                <NoticeList notices={notices} />
              </Board>

              <Board title="과제함" isTeacher={isTeacher}>
                <AssignmentList assignments={assignments} />
              </Board>
            </div>

            <div className="flex-[2] min-h-0">
              <Board title="빌드 히스토리">
                <BuildHistory buildHistories={buildHistories} />
              </Board>
            </div>
          </div>

          <Board title="학생 명단">
            <StudentList students={students} />
          </Board>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
