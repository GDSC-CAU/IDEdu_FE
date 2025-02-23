export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-0 left-0 text-primary text-xl hover:text-gray-600 flex items-center p-2"
    >
      <span>{"<<"}</span>
    </button>
  );
}
