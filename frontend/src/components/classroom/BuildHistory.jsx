export default function BuildHistory({ buildHistories }) {
  // 최신순 정렬
  const sortedHistories = [...buildHistories].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="flex flex-col gap-3 p-2">
      {sortedHistories.map((buildHistory, index) => (
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

      <div className="text-sm text-gray-500 text-right">
        {new Date(createdAt).toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  );
}
