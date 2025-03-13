import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import deleteIcon from "../assets/delete.png";
// import goback from "../assets/goback.png";
import logout from "../assets/logout.png";

function ClassroomCard({ name, content, isTeacher, courseId }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleClassroomClick = () => {
    navigate(`/classroom/${courseId}`);
  };

  const handleCopyClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="flex flex-row w-full px-32 py-4 items-center justify-between font-normal text-lg border-b hover:bg-gray-50"
      onClick={handleClassroomClick}
    >
      <span className="font-semibold">{name}</span>
      <span className="flex items-center gap-2">
        {copied && (
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-300">
            복사됨!
          </span>
        )}
        <span
          className={isTeacher ? "cursor-grab hover:text-blue-500" : ""}
          onClick={isTeacher ? handleCopyClick : undefined}
        >
          {content}
        </span>
      </span>
    </button>
  );
}

function ClassroomList({ isTeacher, courseList }) {
  const headerContent = isTeacher ? "강의실 코드" : "선생님";

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full px-32 py-2 items-center justify-between font-light rounded-lg bg-secondary text-letter text-sm">
        <span>강의실 이름</span>
        <span>{headerContent}</span>
      </div>
      {courseList.length === 0 ? (
        <div className="flex justify-center items-center py-8 text-lg text-gray-600">
          강의가 없습니다.
        </div>
      ) : (
        courseList.map((classroom, index) => (
          <ClassroomCard
            key={index}
            name={classroom.courseName}
            content={isTeacher ? classroom.courseCode : classroom.teacherName}
            courseId={classroom.courseId}
            isTeacher={isTeacher}
          />
        ))
      )}
    </div>
  );
}

function AddClassroomModal({ isOpen, onClose, onSuccess }) {
  const [classroomName, setClassroomName] = useState("");
  const token = localStorage.getItem("token");
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!classroomName.trim()) {
      alert("강의실 이름을 입력해주세요.");
      return;
    }
    try {
      const response = await fetch(
        `http://15.165.155.115:8080/api/classroom/add?name=${encodeURIComponent(
          classroomName
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("강의실 생성 실패");
      }
      const data = await response.json();
      console.log("강의실 생성 성공:", data);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("강의실 생성 오류:", error);
      alert("강의실 추가에 실패했습니다.");
    } finally {
      setClassroomName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4 text-center">강의실 추가</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="강의실 이름을 입력하세요"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
        />
        <button className="w-full dark-btn p-2" onClick={handleSubmit}>
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

function EnterClassroomModal({ isOpen, onClose, onSuccess }) {
  const [classroomCode, setClassroomCode] = useState("");
  const token = localStorage.getItem("token");
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!classroomCode.trim()) {
      alert("강의실 코드를 입력해주세요.");
      return;
    }
    try {
      const response = await fetch(
        `http://15.165.155.115:8080/api/classroom/enter?code=${encodeURIComponent(
          classroomCode
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("강의실 입장 실패");
      }
      const data = await response.json();
      console.log("강의실 입장 성공:", data);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("강의실 생성 오류:", error);
      alert("강의실 추가에 실패했습니다.");
    } finally {
      setClassroomCode("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4 text-center">강의실 입장</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="강의실 코드를 입력하세요"
          value={classroomCode}
          onChange={(e) => setClassroomCode(e.target.value)}
        />
        <button className="w-full dark-btn p-2" onClick={handleSubmit}>
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
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();

  const handleModalButtonClick = () => {
    if (isTeacher) {
      setIsAddModalOpen(true);
    } else {
      setIsEnterModalOpen(true);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://15.165.155.115:8080/api/myprofile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("프로필 가져오기 실패");
      }
      const data = await response.json();
      console.log("프로필 데이터:", data);
      const userInfo = data.result;
      if (userInfo.teacherName) {
        setIsTeacher(true);
        setUsername(userInfo.teacherName);
        setCourseList(userInfo.teacherCourseInfoList || []);
      } else {
        setIsTeacher(false);
        setUsername(userInfo.studentName);
        setCourseList(userInfo.studentCourseInfoList || []);
      }
    } catch (error) {
      console.error("프로필 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  return (
    <div className="flex flex-col h-screen w-full p-20 gap-8">
      <div className="flex flex-row w-full pl-10 items-center justify-between">
        <div className="flex justify-center text-3xl font-bold text-primary">
          {username} 님
        </div>
        <div className="flex flex-row items-center gap-4">
          <button
            className="dark-btn text-xl py-3 px-10"
            onClick={() => handleModalButtonClick()}
          >
            {isTeacher ? "강의실 추가" : "강의실 입장"}
          </button>
          <button className="w-7 h-9" onClick={handleLogout}>
            <img src={logout} alt="logout" className="w-6" />
          </button>
        </div>
      </div>
      <ClassroomList isTeacher={isTeacher} courseList={courseList} />

      {/* 모달 컴포넌트 */}
      <AddClassroomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProfile}
      />
      <EnterClassroomModal
        isOpen={isEnterModalOpen}
        onClose={() => setIsEnterModalOpen(false)}
        onSuccess={fetchProfile}
      />
    </div>
  );
};

export default Dashboard;
