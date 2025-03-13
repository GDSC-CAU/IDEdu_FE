import HalfScreen from "../components/HalfScreen";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import goback from "../assets/goback-w.png";
import CodeMirror from "../components/ide/CodeMirror";
import { useClassroom } from "../hooks/useClassroomData";
import { useState } from "react";

const StudentIDE = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { teacherIdeId, studentIdeId } = useClassroom(courseId);
  const [userId] = useState(() => parseInt(Math.random() * 1000000)); // ✅ 한 번 생성 후 유지

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col h-10 items-start justify-center bg-primary text-white border-b border-white">
        <span
          className="flex items-center gap-4 py-2 px-5 pr-16 cursor-pointer"
          onClick={() => navigate(`/classroom/${courseId}`)}
        >
          <img src={goback} alt="goback" className="w-4" />
          <span>강의실로 돌아가기</span>
        </span>
      </div>
      <div className="grid grid-cols-2 w-full h-full">
        <HalfScreen title="Teacher">
          {/* <CodeEditor
            key={`${userId}-${teacherIdeId}`}
            ideId={teacherIdeId}
            userId={userId}
          /> */}
          <CodeMirror
            key={`${userId}-${teacherIdeId}`}
            ideId={teacherIdeId}
            userId={userId}
          />
        </HalfScreen>
        <HalfScreen title="Student">
          {/* <CodeEditor
            key={`${userId}-${studentIdeId}`}
            ideId={studentIdeId}
            userId={userId}
          /> */}
          <CodeMirror
            key={`${userId}-${studentIdeId}`}
            ideId={studentIdeId}
            userId={userId}
          />
        </HalfScreen>
      </div>
    </div>
  );
};

export default StudentIDE;
