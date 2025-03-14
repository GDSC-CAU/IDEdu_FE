import React, { useEffect, useRef, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import Terminal from "./Terminal";

export default function SCodeEditor({ stompClient, ideId, userId }) {
  const latestVersion = useRef(0);
  const [code, setCode] = useState("");
  const documentId = useRef(ideId);
  const isSyncRequested = useRef(false);

  const [isConnected, setIsConnected] = useState(false);

  // WebSocket 연결 여부 상태 업데이트
  useEffect(() => {
    if (!stompClient.current) return;

    const client = stompClient.current;
    client.onConnect = () => setIsConnected(true);
    client.onDisconnect = () => setIsConnected(false);
  }, [stompClient]);

  useEffect(() => {
    if (!isConnected || !stompClient.current) {
      console.warn("🚨 WebSocket이 아직 연결되지 않음, 구독 대기 중...");
      return;
    }
    const client = stompClient.current;
    console.log(
      "현재 클라 존재, 구독 설정 시작 : ",
      `/sub/edit/${documentId.current}`
    );
    console.log("코드 websocket 구독 시작");
    const subscription = client.subscribe(
      `/sub/edit/${documentId.current}`,
      (msg) => {
        try {
          const data = JSON.parse(msg.body);
          console.log("서버에서 받은 메시지 : ", data);
          handleServerEvent(data);
          console.log("데이터 처리 완료");
        } catch (error) {
          console.error("메시지 파싱 에러:", error);
        }
      }
    );
    console.log("코드 websocket 구독 완료");

    return () => {
      subscription.unsubscribe();
      console.log("코드 websocket 구독 해제");
    };
  }, [isConnected]);

  // SYNC 요청을 구독 완료 후 실행
  useEffect(() => {
    if (!isConnected || !stompClient.current || isSyncRequested.current) return;

    console.log("🔄 SYNC 요청 전송 준비 완료");

    const syncMessage = {
      operation: "SYNC",
      documentId: documentId.current,
    };

    stompClient.current.publish({
      destination: "/pub/edit",
      body: JSON.stringify(syncMessage),
    });

    console.log("SYNC 요청 전송 완료:", syncMessage);
    isSyncRequested.current = true; // SYNC 요청 중복 방지
  }, [isConnected]);

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
  };

  return (
    <div className="relative w-full h-full">
      {!stompClient.current?.connected && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          🔌 연결 끊김... 재연결 중
        </div>
      )}
      <CodeMirror
        value={code}
        height="100%"
        extensions={[javascript()]}
        onChange={handleChange}
      />
      <div className="absolute bottom-0 left-0 right-0">
        {stompClient.current?.connected && (
          <Terminal
            stompClient={stompClient}
            ideId={documentId.current}
            code={code}
          />
        )}
      </div>
    </div>
  );
}
