import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function CodeEditor({ ideId, userId }) {
  const editorRef = useRef(null);
  const stompClient = useRef(null);
  const isMounted = useRef(true); // 컴포넌트 마운트 상태 유지
  const isConnectedRef = useRef(false); // 웹소켓 연결 상태
  const [code, setCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const latestVersion = useRef(0);
  const isIgnoring = useRef(false);
  const documentId = useRef(ideId);

  // 서버에서 받은 이벤트 처리
  const handleServerEvent = useCallback((data) => {
    if (data.userId === userId) {
      console.log("자신의 메시지 무시");
      latestVersion.current = data.version;
      return;
    }
    console.log("서버에서 받은 메시지:", data);
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    // 1차원 position을 2차원(line, column)으로 변환
    const pos = model.getPositionAt(data.position);

    isIgnoring.current = true; // 무시 시작

    switch (data.operation) {
      // case "SYNC":
      //   console.log("SYNC 받음:", data.content);
      //   setCode(data.content);
      //   setLatestVersion(data.version);
      //   break;

      case "INSERT":
        console.log("삽입 이벤트 받음:", data);
        model.pushEditOperations(
          [],
          [
            {
              range: {
                startLineNumber: pos.lineNumber,
                startColumn: pos.column,
                endLineNumber: pos.lineNumber,
                endColumn: pos.column,
              },
              text: data.insertContent,
            },
          ],
          () => null
        );
        break;
      case "DELETE":
        console.log("삭제 이벤트 받음:", data);
        const endPos = model.getPositionAt(data.position + data.deleteLength);
        model.pushEditOperations(
          [],
          [
            {
              range: {
                startLineNumber: pos.lineNumber,
                startColumn: pos.column,
                endLineNumber: endPos.lineNumber,
                endColumn: endPos.column,
              },
              text: "",
            },
          ],
          () => null
        );
        break;

      case "CURSOR":
        console.log("커서 업데이트:", data);
        break;

      default:
        console.warn("알 수 없는 이벤트 타입:", data.operation);
    }

    latestVersion.current = data.version;
    setTimeout(() => {
      isIgnoring.current = false; // 무시 종료
    }, 50);
  }, []);

  useEffect(() => {
    if (isConnectedRef.current) {
      console.log("WebSocket이 이미 활성화되어 있음, 중복 실행 방지");
      return;
    }

    documentId.current = ideId;
    isMounted.current = true;

    console.log("컴포넌트 마운트 완료, 웹소켓 연결 시작");
    const sock = new SockJS("http://15.165.155.115:8080/ws"); // SockJS 연결
    stompClient.current = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 10000, // 10초 후 자동 재연결
      debug: (str) => console.log("STOMP Debug:", str),

      onConnect: () => {
        if (!isMounted.current) return;
        console.log("웹소켓 연결 성공");
        setIsConnected(true);
        isConnectedRef.current = true; // 웹소켓 활성화 됨을 기록
        // subscribeToTopics();
        // sendSyncRequest(); // 최신 문서 요청

        console.log(
          "현재 클라 존재, 구독 설정 시작 : ",
          `/sub/edit/${documentId.current}`
        );
        console.log("웹소켓 연결상태 :", stompClient.current.connected);
        try {
          stompClient.current.subscribe(
            `/sub/edit/${documentId.current}`,
            (message) => {
              console.log("메시지 수신:", message.body || "메시지 없음");
              try {
                const data = JSON.parse(message.body);
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
      },
      onDisconnect: () => {
        if (!isMounted.current) return;
        setIsConnected(false);
        isConnectedRef.current = false; // 웹소켓 비활성화 됨을 기록
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
      console.log("웹소켓 연결 시도 중");
    } catch (error) {
      console.error("웹소켓 연결 시도 중 에러:", error);
    }

    return () => {
      isMounted.current = false;
      if (stompClient.current && stompClient.current.active) {
        try {
          stompClient.current.deactivate();
          console.log("웹소켓 연결 해제 완료");
        } catch (error) {
          console.error("웹소켓 연결 해제 중 에러:", error);
        } finally {
          stompClient.current = null;
          isConnectedRef.current = false; // 웹소켓 비활성화 됨을 기록
        }
      }
    };
  }, [handleServerEvent]);

  // Monaco Editor 이벤트 감지
  const handleEditorDidMount = useCallback(
    (editor) => {
      console.log("에디터 마운트 시작");
      editorRef.current = editor;

      const handleContentChange = (event) => {
        if (isIgnoring.current || !stompClient.current?.connected) return;
        console.log("제발제발 documentId : ", documentId.current);
        event.changes.forEach((change) => {
          if (change.rangeLength > 0) {
            const deleteMessage = {
              operation: "DELETE",
              documentId: documentId.current,
              insertContent: "",
              deleteLength: change.rangeLength,
              position: change.rangeOffset,
              baseVersion: latestVersion.current,
              userId: userId,
            };

            stompClient.current.publish({
              destination: "/pub/edit",
              body: JSON.stringify(deleteMessage),
            });

            console.log("DELETE 메시지 전송 완료", deleteMessage);
          }

          // 삽입이 있는 경우 INSERT 메시지 전송
          if (change.text.length > 0) {
            const insertMessage = {
              operation: "INSERT",
              documentId: documentId.current,
              insertContent: change.text,
              deleteLength: 0,
              position: change.rangeOffset,
              baseVersion: latestVersion.current,
              userId: userId,
            };

            stompClient.current.publish({
              destination: "/pub/edit",
              body: JSON.stringify(insertMessage),
            });

            console.log("INSERT 메시지 전송 완료", insertMessage);
          }
        });
      };

      editor.onDidChangeModelContent(handleContentChange);
    },
    [latestVersion]
  );

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
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          readOnly: !isConnected,
        }}
      />
    </div>
  );
}
