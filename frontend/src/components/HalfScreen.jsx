import Header from "./Header";

export default function HalfScreen({ title, children }) {
  return (
    <div className="half-screen">
      <Header title={title} />
      <div className="flex flex-col items-center justify-center flex-1">
        {children}
      </div>
    </div>
  );
}
