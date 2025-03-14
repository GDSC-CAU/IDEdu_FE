import AddButton from "./AddButton";
import add from "../assets/add.png";

export default function Board({ title, children, isTeacher }) {
  return (
    <div className="flex flex-col border border-primary bg-secondary rounded-lg p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-primary">{title}</h2>
        <div className="flex gap-4">
          {isTeacher && (
            <button>
              <img src={add} alt="add" className="w-5" />
            </button>
          )}
          <button className="text-gray-500">⋯</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
    </div>
  );
}
