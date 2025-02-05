const Classroom = () => {
  return (
    <div className="flex flex-col h-screen w-full p-20 gap-8">
      <div className="flex flex-row w-full px-10 items-center justify-between">
        <div className="flex justify-center text-3xl font-bold text-primary">
          강의실1
        </div>
        <button className="flex justify-center bg-primary text-2xl py-3 px-10 text-white rounded-lg border border-primary hover:bg-secondary hover:text-primary">
          수업하기
        </button>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-4 h-full">
        {/* 왼쪽 영역: 공지사항, 과제함, 빌드 히스토리 */}
        <div className="grid grid-cols-2 grid-rows-[2fr_1fr] gap-4 h-full">
          {/* 공지사항 */}
          <div className="flex flex-col border border-primary bg-secondary rounded-lg p-5 justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-mono text-primary">공지사항</h2>
              <button className="text-gray-500">⋯</button>
            </div>
            <div className="flex-1">{/* 공지사항 내용 */}</div>
            <button className="w-full border border-primary rounded-lg p-2 mt-4">
              +
            </button>
          </div>

          {/* 과제함 */}
          <div className="flex flex-col border border-primary bg-secondary rounded-lg p-5 justify-between">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-mono text-primary">과제함</h2>
              <button className="text-gray-500">⋯</button>
            </div>
            <div className="flex-1">{/* 과제함 내용 */}</div>
            <button className="w-full border border-primary rounded-lg p-2 mt-4">
              +
            </button>
          </div>

          {/* 빌드 히스토리 */}
          <div className="col-span-2 border border-primary bg-secondary rounded-lg p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-mono text-primary">빌드 히스토리</h2>
              <button className="text-gray-500">⋯</button>
            </div>
            <div className="flex-1">{/* 빌드 히스토리 내용 */}</div>
          </div>
        </div>

        {/* 오른쪽 영역: 학생 명단 */}
        <div className="border border-primary bg-secondary rounded-lg p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-mono text-primary">학생 명단</h2>
            <button className="text-gray-500">⋯</button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex-1">{/* 학생 명단 내용 */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
