export default function LoginSection({ handleUserSelect }) {
  return (
    <div className="flex flex-col items-center justify-center h-2/3 w-2/3 gap-4">
      <h1 className="text-2xl text-letter font-jetbrains p-4">I'm a ...</h1>
      <div className="flex flex-row gap-4 justify-center items-center">
        <span className="text-primary text-5xl font-jetbrains">{`{`}</span>
        <button className="main-btn" onClick={() => handleUserSelect(true)}>
          teacher
        </button>
        <span className="text-letter text-4xl font-jetbrains">{`||`}</span>
        <button className="main-btn" onClick={() => handleUserSelect(false)}>
          student
        </button>
        <span className="text-primary text-5xl font-jetbrains">{`}`}</span>
      </div>
    </div>
  );
}
