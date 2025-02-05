export default function Board({ title, children, className = "" }) {
  return (
    <div
      className={`border border-primary bg-secondary rounded-lg p-5 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-primary">{title}</h2>
        <button className="text-gray-500">⋯</button>
      </div>
      {children}
    </div>
  );
}
