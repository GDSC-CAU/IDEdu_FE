import { useUser } from "../provider/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import deleteIcon from "../assets/delete.png";

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

function AddClassroomModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4 text-center">강의실 추가</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="강의실 이름을 입력하세요"
        />
        <button className="w-full dark-btn p-2" onClick={onClose}>
          개설하기
        </button>
        <button
          className="p-1 rounded absolute top-2 right-2"
          onClick={onClose}
        >
          <img src={deleteIcon} alt="delete" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function EnterClassroomModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4 text-center">강의실 입장</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="강의실 코드를 입력하세요"
        />
        <button className="w-full dark-btn p-2" onClick={onClose}>
          입장하기
        </button>
        <button
          className="p-1 rounded absolute top-2 right-2"
          onClick={onClose}
        >
          <img src={deleteIcon} alt="delete" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { isTeacher } = useUser();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);

  const handleModalButtonClick = () => {
    if (isTeacher) {
      setIsAddModalOpen(true);
    } else {
      setIsEnterModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full p-20 gap-8">
      <div className="flex flex-row w-full px-10 items-center justify-between">
        <div className="flex justify-center text-4xl font-bold text-primary">
          칠드런 님의 강의
        </div>
        <button
          className="dark-btn text-2xl py-3 px-10"
          onClick={() => handleModalButtonClick()}
        >
          {isTeacher ? "강의실 추가" : "강의실 입장"}
        </button>
      </div>
      <ClassroomList isTeacher={isTeacher} />

      {/* 모달 컴포넌트 */}
      <AddClassroomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EnterClassroomModal
        isOpen={isEnterModalOpen}
        onClose={() => setIsEnterModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
