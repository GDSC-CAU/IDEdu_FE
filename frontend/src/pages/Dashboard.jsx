import { useUser } from "../provider/UserContext";
import { useNavigate } from "react-router-dom";

function ClassroomCard({ name, content }) {
  const navigate = useNavigate();
  const handleClassroomClick = () => {
    navigate(`/classroom`);
  };
  return (
    <button
      className="flex flex-row w-full px-32 py-4 items-center justify-between font-normal text-lg border-b hover:bg-gray-50"
      onClick={handleClassroomClick}
    >
      <span className="font-bold">{name}</span>
      <span>{content}</span>
    </button>
  );
}

function ClassroomList({ isTeacher }) {
  const headerContent = isTeacher ? "강의실 코드" : "선생님";
  const classrooms = isTeacher
    ? [
        { name: "강의실 1", content: "IX035J2" },
        { name: "강의실 2", content: "PK123S1" },
      ]
    : [
        { name: "강의실 1", content: "칠드런" },
        { name: "강의실 2", content: "송정현" },
      ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full px-32 py-2 items-center justify-between font-light rounded-lg bg-secondary text-letter">
        <span>강의실 이름</span>
        <span>{headerContent}</span>
      </div>
      {classrooms.map((classroom, index) => (
        <ClassroomCard
          key={index}
          name={classroom.name}
          content={classroom.content}
        />
      ))}
    </div>
  );
}

const Dashboard = () => {
  const { isTeacher } = useUser();

  return (
    <div className="flex flex-col h-screen w-full p-20 gap-8">
      <div className="flex flex-row w-full px-10 items-center justify-between">
        <div className="flex justify-center text-4xl font-bold text-primary">
          칠드런 님의 강의
        </div>
        <button
          className="flex justify-center bg-primary text-2xl py-3 px-10 text-white rounded-lg border border-primary hover:bg-secondary hover:text-primary"
          // onClick={}
        >
          {isTeacher ? "강의실 추가" : "강의실 입장"}
        </button>
      </div>
      <ClassroomList isTeacher={isTeacher} />
    </div>
  );
};

export default Dashboard;
