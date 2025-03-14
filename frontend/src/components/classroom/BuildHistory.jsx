export default function BuildHistory({ buildHistories }) {
  return (
    <div className="flex flex-col gap-3 p-2">
      {buildHistories.map((buildHistory, index) => (
        <BuildHistoryCard
          key={index}
          member={buildHistory.member}
          result={buildHistory.result}
          createdAt={buildHistory.createdAt}
        />
      ))}
    </div>
  );
}

function BuildHistoryCard({ member, result, createdAt }) {
  // 결과가 에러인지 확인
  const isError = result.includes("[ERROR]");

  // 결과 메시지 정리
  const formattedResult = result
    .replace("[ERROR]\n", "") // ERROR 태그 제거
    .split("\n")[0] // 첫 줄만 사용
    .trim(); // 공백 제거

  const truncatedResult =
    formattedResult.length > 100
      ? formattedResult.slice(0, 100) + "..."
      : formattedResult;

  return (
    <div
      className={`flex items-center justify-between p-2 rounded-lg border ${
        isError ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      }`}
    >
      {/* 이름 */}

      <span className="font-medium truncate">{member}</span>

      {/* 결과 (말줄임표 적용) */}
      <div
        className={`text-sm w-4/5 overflow-hidden truncate ${
          isError ? "text-red-600" : "text-green-600"
        }`}
        title={formattedResult} // 전체 텍스트를 hover 시 표시
      >
        {truncatedResult}
      </div>

      {/* 시간 */}
      <div className="text-sm text-gray-500 text-right">
        {new Date(createdAt).toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
    // <div
    //   className={`flex flex-col gap-2 p-3 rounded-lg border ${
    //     isError ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
    //   }`}
    // >
    //   {/* 상단: 이름과 시간 */}
    //   <div className="flex justify-between items-center">
    //     <div className="flex items-center gap-2">
    //       <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
    //         {member.charAt(0)}
    //       </div>
    //       <span className="font-medium">{member}</span>
    //     </div>
    //     <span className="text-sm text-gray-500">
    //       {new Date(createdAt).toLocaleTimeString()}
    //     </span>
    //   </div>

    //   {/* 하단: 실행 결과 */}
    //   <div
    //     className={`text-sm p-2 rounded ${
    //       isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
    //     }`}
    //   >
    //     <pre className="whitespace-pre-wrap break-words font-mono">
    //       {formattedResult}
    //     </pre>
    //   </div>
    // </div>
  );
}
