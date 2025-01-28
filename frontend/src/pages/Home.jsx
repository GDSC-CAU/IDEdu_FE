import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="grid grid-cols-2 w-full h-screen">
      <div className="flex flex-col h-screen border border-primary">
        <div className="grid grid-cols-[1fr_3fr] h-10">
          <div className="flex items-center justify-center font-mono">
            IDEdu.7dren
          </div>
          <div className="flex bg-primary border border-primary"></div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <img src={logo} alt="logo" className="w-1/2" />
        </div>
      </div>
      <div className="flex flex-col h-screen border border-primary">
        <div className="grid grid-cols-[1fr_3fr] w-full h-10">
          <div className="flex items-center justify-center font-mono">
            login.7dren
          </div>
          <div className="flex bg-primary border border-primary"></div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <h1 className="text-4xl text-letter font-mono">I'm a ...</h1>
          <div className="flex flex-row gap-4 justify-center">
            <span className="text-primary text-6xl font-mono">{`{`}</span>
            <button className=" text-letter text-4xl font-mono hover:bg-yellow-200">
              teacher
            </button>
            <span className="text-letter text-5xl font-mono">{`||`}</span>
            <button className=" text-letter text-4xl font-mono hover:bg-yellow-200">
              student
            </button>
            <span className="text-primary text-6xl font-mono">{`}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
