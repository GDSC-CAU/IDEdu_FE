import { useStudents } from "../hooks/useClassroom";

export default function StudentList() {
  const { students, loading, error } = useStudents();

  if (loading) return <div>로딩중</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-1">
      {students.map((name, index) => (
        <div key={index} className="text-base p-1">
          {name}
        </div>
      ))}
    </div>
  );
}
