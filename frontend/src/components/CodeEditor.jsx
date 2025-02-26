import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const DOCUMENT_ID = 1;
const USER_ID = Math.random().toString(36).substring(7); // 임시 사용자 ID 생성
// const USER_ID = "test";

export default function CodeEditor() {
  const editorRef = useRef(null);
  const stompClient = useRef(null);
  const [code, setCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [latestVersion, setLatestVersion] = useState(0);
  const eventBuffer = useRef(new Map()); // 버퍼링된 이벤트 저장

  useEffect(() => {
    const sock = new SockJS("http://15.165.155.115:8080/ws"); // SockJS 연결
    stompClient.current = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000, // 5초 후 자동 재연결
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: () => {
        setIsConnected(true);
        console.log("웹소켓 연결 성공");
        subscribeToTopics();
        sendSyncRequest(); // 최신 문서 요청
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log("웹소켓 연결 끊김");
      },
      onStompError: (frame) => {
        console.error("STOMP 에러:", frame.headers["message"]);
        console.error("상세 내용:", frame.body);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket 에러 발생:", event);
      },
    });

    try {
      stompClient.current.activate();
    } catch (error) {
      console.error("WebSocket 연결 시도 중 에러:", error);
    }

    console.log("현재 연결 상태:", isConnected);

    return () => {
      sendDisconnect();
      try {
        console.log("WebSocket 연결 해제 중");
        stompClient.current?.deactivate();
      } catch (error) {
        console.error("WebSocket 연결 해제 중 에러:", error);
      }
    };
  }, []);

  // 서버 메시지 구독
  const subscribeToTopics = () => {
    console.log("subscribeToTopics 호출중");
    if (!stompClient.current) {
      console.log("stompClient.current가 없습니다.");
      return;
    }
    if (!stompClient.current.connected) {
      console.error("stompClient가 연결되지 않음");
      return;
    }

    console.log("응?");
    try {
      console.log("2. 구독 시도:", `/sub/edit/${DOCUMENT_ID}`);

      stompClient.current.subscribe(`/sub/edit/${DOCUMENT_ID}`, (message) => {
        console.log("3. 메시지 수신:", message);
        const data = JSON.parse(message.body);
        console.log("4. 파싱된 데이터:", data);
        handleServerEvent(data);
        console.log("5. 메시지 처리 완료");
      });

      console.log("6. 구독 설정 완료");

      // SYNC 요청
      sendSyncRequest();
    } catch (error) {
      console.error("구독 중 에러:", error);
    }
  };

  // 최신 문서 상태 요청 (SYNC)
  const sendSyncRequest = () => {
    console.log("sendSyncRequest 호출중");
    if (!stompClient.current || !stompClient.current.connected) {
      console.log("stompClient.current가 없거나 연결되지 않았습니다.");
      return;
    }

    stompClient.current.publish({
      destination: "/pub/edit",
      body: JSON.stringify({ type: "SYNC", documentId: DOCUMENT_ID }),
    });
    console.log("최신 문서 상태 요청 완료");
  };

  // 사용자가 편집 종료 (DISCONNECT)
  const sendDisconnect = () => {
    if (!stompClient.current || !stompClient.current.connected) return;

    stompClient.current.publish({
      destination: "/pub/edit",
      body: JSON.stringify({
        type: "DISCONNECT",
        documentId: DOCUMENT_ID,
        userId: USER_ID,
      }),
    });
  };

  // 편집 이벤트 전송
  const sendEdit = useCallback(
    (change) => {
      if (!isConnected || !stompClient.current) {
        console.log("웹소켓 연결 안됐거나 stompClient.current가 없습니다.");
        return;
      }
      console.log("sendEdit 호출됨", change);

      stompClient.current.publish({
        destination: "/pub/edit",
        body: JSON.stringify(change),
      });
      console.log("sendEdit 완료");
    },
    [isConnected]
  );

  // Monaco Editor 이벤트 감지
  const handleEditorDidMount = useCallback(
    (editor) => {
      console.log("에디터 마운트 시작");
      editorRef.current = editor;

      // 연결 상태 확인 후 이벤트 핸들러 등록
      if (isConnected && stompClient.current) {
        console.log("✅ WebSocket 연결됨 - 이벤트 핸들러 등록");

        editor.onDidChangeCursorPosition(() => {
          const position = editor.getPosition();
          sendEdit({
            type: "CURSOR",
            documentId: DOCUMENT_ID,
            userId: USER_ID,
            position: {
              lineNumber: position.lineNumber,
              column: position.column,
            },
          });
        });

        editor.onDidChangeModelContent((event) => {
          console.log("내용 변경 감지:", event.changes);
          const changes = event.changes[0];
          if (!changes) return;

          sendEdit({
            type: changes.text.length > 0 ? "INSERT" : "DELETE",
            documentId: DOCUMENT_ID,
            content: changes.text,
            position: changes.rangeOffset,
            baseVersion: latestVersion,
          });
        });
      } else {
        console.log("WebSocket 연결 대기 중");
      }
    },
    [isConnected, stompClient, latestVersion, sendEdit]
  );

  // WebSocket 연결 상태가 변경될 때마다 이벤트 핸들러 재설정
  useEffect(() => {
    if (editorRef.current && isConnected) {
      console.log("WebSocket 연결됨 - 이벤트 핸들러 재설정");
      handleEditorDidMount(editorRef.current);
    }
  }, [isConnected, handleEditorDidMount]);

  // 서버에서 받은 이벤트 처리
  const handleServerEvent = (data) => {
    console.log("서버에서 받은 메시지:", data);

    if (!editorRef.current) return;

    switch (data.type) {
      case "SYNC_RESPONSE":
        console.log("SYNC_RESPONSE 받음:", data.content);
        setCode(data.content);
        setLatestVersion(data.version);
        break;

      case "INSERT_UPDATE":
      case "DELETE_UPDATE":
        console.log("편집 이벤트 받음:", data);
        processIncomingEdit(data);
        break;

      case "CURSOR_UPDATE":
        console.log("커서 업데이트:", data);
        break;

      case "USER_DISCONNECTED":
        console.log(`User ${data.userId} disconnected`);
        break;

      default:
        console.warn("알 수 없는 이벤트 타입:", data.type);
    }
  };

  // 순서 보장 (버퍼링 후 적용)
  const processIncomingEdit = (data) => {
    if (!editorRef.current) return;

    console.log("편집 적용 시도:", data);

    if (data.version === latestVersion + 1) {
      applyEdit(data);
      setLatestVersion(data.version);
      console.log("편집 적용 완료");

      // 버퍼에 저장된 이후 버전이 있는지 확인
      while (eventBuffer.current.has(latestVersion + 1)) {
        const nextEvent = eventBuffer.current.get(latestVersion + 1);
        eventBuffer.current.delete(latestVersion + 1);
        applyEdit(nextEvent);
        setLatestVersion(nextEvent.version);
      }
    } else if (data.version > latestVersion + 1) {
      // 순서가 맞지 않으면 버퍼에 저장
      eventBuffer.current.set(data.version, data);
    }
  };

  // 실제 편집 이벤트 적용
  const applyEdit = (data) => {
    editorRef.current.executeEdits("", [
      {
        range: {
          startLineNumber: 1,
          startColumn: data.position + 1,
          endLineNumber: 1,
          endColumn:
            data.position + 1 + (data.content ? data.content.length : 0),
        },
        text: data.type === "DELETE_UPDATE" ? "" : data.content,
        forceMoveMarkers: true,
      },
    ]);

    setCode(editorRef.current.getValue());
  };

  return (
    <div className="relative w-full h-full">
      {!isConnected && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          연결 끊김... 재연결 중
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        // theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          readOnly: !isConnected,
        }}
      />
    </div>
  );
}
