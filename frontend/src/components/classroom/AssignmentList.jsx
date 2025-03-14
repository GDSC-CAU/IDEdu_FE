export default function AssignmentList({ assignments }) {
  return (
    <div className="flex flex-col gap-4">
      {assignments.map((assignment, index) => (
        <div key={index} className="text-lg text-gray-800">
          {assignment.content}
        </div>
      ))}
    </div>
  );
}
