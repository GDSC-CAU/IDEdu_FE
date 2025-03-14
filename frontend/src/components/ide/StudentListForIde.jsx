export default function StudentListForIde({ students }) {
  return (
    <div className="flex flex-col gap-2 w-full px-2">
      {students.map((student, index) => (
        <div
          key={index}
          className="flex flex-row justify-between items-center w-full text-lg"
        >
          <button className="hover:text-blue-500">{student.memberName}</button>
          <span>요청</span>
        </div>
      ))}
    </div>
  );
}
