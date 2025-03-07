import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const DOCUMENT_ID = 1;
const USER_ID = parseInt(Math.floor(Math.random() * 1000000)); // int형
// const USER_ID = 1234;

export default function CodeEditor() {
  const editorRef = useRef(null);
  const stompClient = useRef(null);
  const isMounted = useRef(true); // 컴포넌트 마운트 상태 유지
  const isConnectedRef = useRef(false); // 웹소켓 연결 상태를 useRef로 관리
  const [code, setCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [latestVersion, setLatestVersion] = useState(0);
  const eventBuffer = useRef(new Map()); // 버퍼링된 이벤트 저장

  // 서버에서 받은 이벤트 처리
  const handleServerEvent = useCallback((data) => {
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
        // processIncomingEdit(data);
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
  }, []);

  useEffect(() => {
    if (isConnectedRef.current) {
      console.log("✅ WebSocket이 이미 활성화되어 있음, 중복 실행 방지");
      return;
    }

    isMounted.current = true;
    console.log("컴포넌트 마운트 완료, 웹소켓 연결 시작");
    const sock = new SockJS("http://15.165.155.115:8080/ws"); // SockJS 연결
    stompClient.current = new Client({
      webSocketFactory: () => {
        console.log("연결 중인 웹소켓 주소 : ", sock.url);
        return sock;
      },

      reconnectDelay: 10000, // 10초 후 자동 재연결
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: (frame) => {
        console.log("STOMP Debug: 연결ㄹㄹㄹㄹㄹ", frame.headers);
        console.log("STOMP Debug: connected to server", stompClient.brokerURL);

        if (!isMounted.current) return;
        console.log("웹소켓 연결상태 :", stompClient.current.connected);
        console.log("웹소켓 연결 성공");
        setIsConnected(true);
        isConnectedRef.current = true; // 웹소켓 활성화 됨을 기록
        // subscribeToTopics();
        // sendSyncRequest(); // 최신 문서 요청

        console.log(
          "현재 클라 존재, 구독 설정 시작 : ",
          `/sub/edit/${DOCUMENT_ID}`
        );
        console.log("웹소켓 연결상태 :", stompClient.current.connected);
        try {
          stompClient.current.subscribe(
            `/sub/edit/${DOCUMENT_ID}`,
            (message) => {
              console.log("메시지 수신:", message);
              const data = JSON.parse(message.body);
              handleServerEvent(data);
            }
          );
          console.log("구독 성공");
          console.log("웹소켓 연결상태 :", stompClient.current.connected);
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
    // console.log("웹소켓 연결??", isConnected);
    return () => {
      isMounted.current = false;
      if (stompClient.current && stompClient.current.active) {
        try {
          // sendDisconnect();
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

  // 서버 메시지 구독
  // const subscribeToTopics = () => {
  //   console.log("subscribeToTopics 호출중");
  //   if (!stompClient.current) {
  //     console.log("stompClient.current가 없습니다.");
  //     return;
  //   }
  //   if (!stompClient.current.connected) {
  //     console.error("stompClient가 연결되지 않음");
  //     return;
  //   }

  //   try {
  //     console.log("2. 구독 시도:", `/sub/edit/${DOCUMENT_ID}`);

  //     stompClient.current.subscribe(`/sub/edit/${DOCUMENT_ID}`, (message) => {
  //       console.log("3. 메시지 수신:", message);
  //       const data = JSON.parse(message.body);
  //       console.log("4. 파싱된 데이터:", data);
  //       handleServerEvent(data);
  //       console.log("5. 메시지 처리 완료");
  //     });

  //     console.log("6. 구독 설정 완료");

  //     // SYNC 요청
  //     sendSyncRequest();
  //   } catch (error) {
  //     console.error("구독 중 에러:", error);
  //   }
  // };

  // 최신 문서 상태 요청 (SYNC)
  // const sendSyncRequest = () => {
  //   console.log("sendSyncRequest 호출중");
  //   if (!stompClient.current || !stompClient.current.connected) {
  //     console.log("stompClient.current가 없거나 연결되지 않았습니다.");
  //     return;
  //   }

  //   // stompClient.current.publish({
  //   //   destination: "/pub/edit",
  //   //   body: JSON.stringify({ type: "SYNC", documentId: DOCUMENT_ID }),
  //   // });
  //   console.log("최신 문서 상태 요청 완료");
  // };

  // 사용자가 편집 종료 (DISCONNECT)
  // const sendDisconnect = () => {
  //   if (!stompClient.current || !stompClient.current.connected) return;

  //   stompClient.current.publish({
  //     destination: "/pub/edit",
  //     body: JSON.stringify({
  //       type: "DISCONNECT",
  //       documentId: DOCUMENT_ID,
  //       userId: USER_ID,
  //     }),
  //   });
  // };

  // 2차원 position을 1차원으로 변환
  // const getOffset = (model, position) => {
  //   return model.getOffsetAt({
  //     lineNumber: position.lineNumber,
  //     column: position.column,
  //   });
  // };

  // 사용
  // const sendEdit = useCallback(
  //   (change) => {
  //     if (!isConnected || !stompClient.current) return;

  //     console.log("변경 이벤트:", change);

  //     // 커서 이벤트인 경우
  //     if (change.type === "CURSOR") {
  //       // const message = {
  //       //   operation: "CURSOR",
  //       //   documentId: DOCUMENT_ID,
  //       //   insertContent: null,
  //       //   deleteLength: null,
  //       //   position: change.position.column - 1, // 0-based position
  //       //   baseVersion: latestVersion,
  //       //   userId: USER_ID,
  //       // };

  //       // stompClient.current.publish({
  //       //   destination: "/pub/edit",
  //       //   body: JSON.stringify(message),
  //       // });
  //       return;
  //     }

  //     // 텍스트 변경 이벤트인 경우
  //     const message = {
  //       operation: change.text ? "INSERT" : "DELETE",
  //       documentId: DOCUMENT_ID,
  //       insertContent: change.text,
  //       deleteLength: change.rangeLength || 0,
  //       position: change.rangeOffset,
  //       baseVersion: latestVersion,
  //       userId: USER_ID,
  //     };

  //     stompClient.current.publish({
  //       destination: "/pub/edit",
  //       body: JSON.stringify(message),
  //     });
  //   },
  //   [isConnected, stompClient, latestVersion]
  // );

  // Monaco Editor 이벤트 감지
  const handleEditorDidMount = useCallback(
    (editor) => {
      console.log("에디터 마운트 시작");
      editorRef.current = editor;

      // 연결 상태 확인 후 이벤트 핸들러 등록
      if (isConnected && stompClient.current) {
        console.log("WebSocket 연결됨 - 이벤트 핸들러 등록");

        editor.onDidChangeModelContent((event) => {
          if (!isConnected || !stompClient.current) return;

          console.log("내용 변경 감지:", event.changes);
          const changes = event.changes[0];
          if (!changes) return;

          const message = {
            operation: changes.text.length > 0 ? "INSERT" : "DELETE",
            documentId: DOCUMENT_ID,
            insertContent: changes.text,
            deleteLength: changes.rangeLength || 0,
            position: changes.rangeOffset,
            baseVersion: latestVersion,
            userId: USER_ID,
          };

          console.log("전송할 메시지:", message); // 메시지 확인
          console.log("연결 상태:", isConnected); // 연결 상태 확인
          console.log("stompClient:", stompClient.current); // stompClient 확인

          try {
            stompClient.current.publish({
              destination: "/pub/edit",
              body: JSON.stringify(message),
            });
            console.log("메시지 전송 완료");
          } catch (error) {
            console.error("메시지 전송 실패:", error);
          }
        });
      }
    },
    [isConnected, stompClient, latestVersion]
  );

  // WebSocket 연결 상태가 변경될 때마다 이벤트 핸들러 재설정
  // useEffect(() => {
  //   if (editorRef.current && isConnected) {
  //     console.log("WebSocket 연결됨 - 이벤트 핸들러 재설정");
  //     handleEditorDidMount(editorRef.current);
  //   }
  // }, [isConnected, handleEditorDidMount]);

  // 순서 보장 (버퍼링 후 적용)
  // const processIncomingEdit = (data) => {
  //   if (!editorRef.current) return;

  //   console.log("편집 적용 시도:", data);

  //   if (data.version === latestVersion + 1) {
  //     applyEdit(data);
  //     setLatestVersion(data.version);
  //     console.log("편집 적용 완료");

  //     // 버퍼에 저장된 이후 버전이 있는지 확인
  //     while (eventBuffer.current.has(latestVersion + 1)) {
  //       const nextEvent = eventBuffer.current.get(latestVersion + 1);
  //       eventBuffer.current.delete(latestVersion + 1);
  //       applyEdit(nextEvent);
  //       setLatestVersion(nextEvent.version);
  //     }
  //   } else if (data.version > latestVersion + 1) {
  //     // 순서가 맞지 않으면 버퍼에 저장
  //     eventBuffer.current.set(data.version, data);
  //   }
  // };

  // 실제 편집 이벤트 적용
  // const applyEdit = (data) => {
  //   editorRef.current.executeEdits("", [
  //     {
  //       range: {
  //         startLineNumber: 1,
  //         startColumn: data.position + 1,
  //         endLineNumber: 1,
  //         endColumn:
  //           data.position + 1 + (data.content ? data.content.length : 0),
  //       },
  //       text: data.type === "DELETE_UPDATE" ? "" : data.content,
  //       forceMoveMarkers: true,
  //     },
  //   ]);

  //   setCode(editorRef.current.getValue());
  // };

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
