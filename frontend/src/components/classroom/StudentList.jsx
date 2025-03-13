export default function StudentList({ students }) {
  return (
    <div className="flex flex-col gap-1">
      {students.map((student, index) => (
        <div key={index} className="text-base p-1">
          {student.memberName}
        </div>
      ))}
    </div>
  );
}
