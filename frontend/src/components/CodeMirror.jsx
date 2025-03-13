import React, { useEffect, useRef, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import CodeMirror from "@uiw/react-codemirror";

export default function CodeEditor({ ideId, userId }) {
  const stompClient = useRef(null);
  const isConnectedRef = useRef(false);
  const latestVersion = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const [code, setCode] = useState("");
  const documentId = useRef(ideId);
  const isSyncRequested = useRef(false);

  useEffect(() => {
    if (isConnectedRef.current) {
      console.log("WebSocket이 이미 활성화되어 있음, 중복 실행 방지");
      return;
    }

    // 웹소켓 연결 설정
    console.log("컴포넌트 마운트 완료, 웹소켓 연결 시작");
    const sock = new SockJS("http://15.165.155.115:8080/ws");
    stompClient.current = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 10000,
      debug: (str) => console.log("STOMP Debug:", str),

      onConnect: () => {
        console.log("웹소켓 연결 성공");
        setIsConnected(true);
        isConnectedRef.current = true;

        console.log(
          "현재 클라 존재, 구독 설정 시작 : ",
          `/sub/edit/${documentId.current}`
        );
        console.log("웹소켓 연결상태 :", stompClient.current.connected);

        try {
          stompClient.current.subscribe(
            `/sub/edit/${documentId.current}`,
            (message) => {
              try {
                const data = JSON.parse(message.body);
                console.log("서버에서 받은 메시지 : ", data);
                handleServerEvent(data);
                console.log("데이터 처리 완료");
              } catch (error) {
                console.error("메시지 파싱 에러:", error);
              }
            }
          );
          console.log("구독 성공");
        } catch (error) {
          console.error("구독 실패 에러 :", error);
        }
        // // ✅ 최초 렌더링 시 `SYNC` 요청 한 번만 전송
        // if (!isSyncRequested.current) {
        //   const syncMessage = {
        //     operation: "SYNC",
        //     documentId: documentId.current,
        //   };
        //   stompClient.current.publish({
        //     destination: "/pub/edit",
        //     body: JSON.stringify(syncMessage),
        //   });
        //   console.log("🔄 SYNC 요청 전송:", syncMessage);
        //   isSyncRequested.current = true; // SYNC 요청을 다시 보내지 않도록 설정
        // }

        console.log("WebSocket 연결 성공!");
      },

      onDisconnect: () => {
        setIsConnected(false);
        isConnectedRef.current = false;
        isSyncRequested.current = false;
        console.log("WebSocket 연결 끊김");
      },

      onStompError: (frame) => {
        console.error("STOMP 에러:", frame.headers["message"], frame.body);
      },

      onWebSocketError: (event) => {
        console.error("WebSocket 에러:", event);
      },
    });

    stompClient.current.activate();
    console.log("WebSocket 연결 시도 중");

    return () => {
      if (stompClient.current && stompClient.current.active) {
        stompClient.current.deactivate();
        stompClient.current = null;
        isConnectedRef.current = false;
      }
    };
  }, []);

  // 서버에서 받은 이벤트만으로 코드 업데이트
  const handleServerEvent = (data) => {
    latestVersion.current = data.version;

    setCode((prevCode) => {
      if (data.operation === "SYNC") {
        console.log("sync 이벤트 받음:", data);
        return data.content ?? prevCode;
      } else if (data.operation === "DELETE") {
        return (
          prevCode.slice(0, data.position) +
          prevCode.slice(data.position + data.deleteLength)
        );
      } else if (data.operation === "INSERT") {
        return (
          prevCode.slice(0, data.position) +
          data.insertContent +
          prevCode.slice(data.position)
        );
      }

      return prevCode;
    });
  };

  // 사용자의 입력을 서버로 전송만 하고, 로컬 상태 변경 X
  const handleChange = (value, viewUpdate) => {
    const changes = viewUpdate.changes;

    changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      const deleteLength = toA - fromA;
      const insertContent = inserted.text.join("\n");
      const position = fromA;

      if (deleteLength > 0) {
        // DELETE 먼저 전송
        const deleteMessage = {
          operation: "DELETE",
          documentId: documentId.current,
          insertContent: "",
          deleteLength,
          position,
          baseVersion: latestVersion.current,
          userId: userId,
        };

        stompClient.current.publish({
          destination: "/pub/edit",
          body: JSON.stringify(deleteMessage),
        });

        console.log("서버로 DELETE 전송:", deleteMessage);
      }

      if (insertContent.length > 0) {
        // INSERT 전송
        const insertMessage = {
          operation: "INSERT",
          documentId: documentId.current,
          insertContent,
          deleteLength: 0,
          position,
          baseVersion: latestVersion.current,
          userId: userId,
        };

        stompClient.current.publish({
          destination: "/pub/edit",
          body: JSON.stringify(insertMessage),
        });

        console.log("서버로 INSERT 전송:", insertMessage);
      }
    });

    // ❌ `setCode(value)` 호출 X → 직접 로컬 변경 금지!
  };

  return (
    <div className="relative w-full h-full">
      {!isConnected && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          연결 끊김... 재연결 중
        </div>
      )}
      <CodeMirror
        value={code}
        height="100%"
        extensions={[javascript()]}
        onChange={handleChange}
      />
    </div>
  );
}
