import React, { useEffect, useRef, useState } from "react";
import run from "../../assets/run.png";

export default function Terminal({ stompClient, ideId, code }) {
  const [output, setOutput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("python");
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!stompClient.current || !stompClient.current.connected) {
      console.warn("🚨 WebSocket이 아직 연결되지 않음, 구독 대기 중...");
      return;
    }
    const client = stompClient.current;

    console.log("터미널 WebSocket 구독 시작");
    const subscription = client.subscribe(`/sub/output/${ideId}`, (msg) => {
      setOutput((prevOutput) => prevOutput + "\n" + msg.body);
    });
    console.log("output", output);
    console.log("터미널 WebSocket 구독 완료");

    return () => {
      subscription.unsubscribe();
      console.log("터미널 WebSocket 구독 해제");
    };
  }, [stompClient, ideId]);

  const sendCompileRequest = () => {
    if (!stompClient.current) return;
    // setOutput("");

    const request = {
      ideId: ideId,
      language,
      code,
      // input: userInput,
    };

    stompClient.current.publish({
      destination: "/pub/compile",
      body: JSON.stringify(request),
    });

    console.log("🚀 코드 실행 요청 전송:", request);
  };

  const sendUserInput = () => {
    if (!stompClient.current) return;

    const inputMessage = {
      sessionId: ideId,
      input: userInput,
    };

    stompClient.current.publish({
      destination: "/pub/input",
      body: JSON.stringify(inputMessage),
    });

    console.log("🔗 터미널 입력 전송:", inputMessage);

    setUserInput("");
  };
  // Enter 키로 입력 전송
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && userInput.trim() !== "") {
      sendUserInput();
    }
  };

  // 터미널 자동 스크롤
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="flex flex-col py-4 px-2 bg-primary text-white font-mono">
      {/* 언어 선택 & 실행 버튼 */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1 border border-gray-400 bg-white text-black focus:outline-none"
        >
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="python">Python</option>
        </select>

        <button
          onClick={sendCompileRequest}
          className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-3 transition"
        >
          <img src={run} alt="run" className="w-3" />
          <span>Run</span>
        </button>
      </div>

      {/* 실행 결과 (터미널) */}
      <div
        ref={terminalRef}
        className="bg-gray-100 text-black p-3 h-[150px] overflow-y-auto whitespace-pre-wrap break-words"
      >
        {output || "실행 결과가 여기에 표시됩니다"}
      </div>

      {/* 사용자 입력 */}
      <input
        type="text"
        placeholder="입력값을 입력하세요"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 mt-2 bg-gray-100 border border-gray-500 text-black focus:outline-none"
      />
    </div>
  );
}
