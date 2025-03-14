import HalfScreen from "../components/HalfScreen";
import { useNavigate } from "react-router-dom";
import goback from "../assets/goback-w.png";
import CodeEditor from "../components/ide/CodeMirror";
// import SCodeEditor from "../components/ide/SCodeMirror";
import { useParams } from "react-router-dom";
import { useClassroom } from "../hooks/useClassroomData";
import { useState, useRef, useEffect } from "react";
import StudentListForIde from "../components/ide/StudentListForIde";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";

const TeacherIDE = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { teacherIdeId, students } = useClassroom(courseId);
  const [userId] = useState(() => parseInt(Math.random() * 1000000)); //한 번 생성 후 유지
  // const stompClient = useRef(null);
  // const isConnectedRef = useRef(false);

  // useEffect(() => {
  //   if (isConnectedRef.current) {
  //     console.log("WebSocket이 이미 활성화되어 있음, 중복 실행 방지");
  //     return;
  //   }

  //   // 웹소켓 연결 설정
  //   console.log("컴포넌트 마운트 완료, 웹소켓 연결 시작");
  //   const sock = new SockJS("http://15.165.155.115:8080/ws");
  //   stompClient.current = new Client({
  //     webSocketFactory: () => sock,
  //     reconnectDelay: 10000,
  //     debug: (str) => console.log("STOMP Debug:", str),

  //     onConnect: () => {
  //       console.log("웹소켓 연결 성공");
  //       isConnectedRef.current = true;

  //       console.log("WebSocket 연결 성공!");
  //     },

  //     onDisconnect: () => {
  //       isConnectedRef.current = false;
  //       console.log("WebSocket 연결 끊김");
  //     },

  //     onStompError: (frame) => {
  //       console.error("STOMP 에러:", frame.headers["message"], frame.body);
  //     },

  //     onWebSocketError: (event) => {
  //       console.error("WebSocket 에러:", event);
  //     },
  //   });
  //   stompClient.current.activate();
  //   console.log("웹소켓 stompClient 활성화");

  //   return () => {
  //     if (stompClient.current && stompClient.current.active) {
  //       stompClient.current.deactivate();
  //       console.log("웹소켓 stompClient 비활성화");
  //       stompClient.current = null;
  //       isConnectedRef.current = false;
  //     }
  //   };
  // }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col h-10 items-start justify-center bg-primary text-white border-b border-white">
        <span
          className="flex items-center gap-4 py-2 px-5 cursor-pointer"
          onClick={() => navigate(`/classroom/${courseId}`)}
        >
          <img src={goback} alt="goback" className="w-4" />
          <span>강의실로 돌아가기</span>
        </span>
      </div>
      <div className="grid grid-cols-[3fr_1fr] w-full h-full">
        <HalfScreen title="Teacher">
          {/* <CodeEditor
            key={`${userId}-${teacherIdeId}`}
            ideId={teacherIdeId}
            userId={userId}
          /> */}
          <CodeEditor
            key={`${userId}-${teacherIdeId}`}
            ideId={teacherIdeId}
            userId={userId}
          />
        </HalfScreen>
        <div className="flex flex-col items-center p-5 gap-3">
          <button className="bg-secondary p-2 w-4/5 hover:bg-primary hover:text-white">
            수업 중
          </button>
          <div className="text-center text-sm text-gray-400">
            수업 중입니다. <br /> 코드 에디터와 터미널을 공유 중입니다.
          </div>
          <div className="flex flex-row justify-between items-center w-full mt-2">
            <h1 className="text-lg">학생명단</h1>
            <span>도움요청</span>
          </div>
          <StudentListForIde students={students} />
        </div>
      </div>
    </div>
  );
};

export default TeacherIDE;
