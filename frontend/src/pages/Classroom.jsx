const Classroom = () => {
  return (
    <div className="flex flex-col h-screen w-full p-20">
      <div className="flex flex-row w-full px-10 bg-blue-100 items-center justify-between">
        <div className="flex justify-center text-4xl">강의실1</div>
        <button className="flex justify-center bg-blue-300 text-3xl py-5 px-10">
          수업하기
        </button>
      </div>
      <div className="flex w-full bg-blue-200"></div>
    </div>
  );
};

export default Classroom;
