import deleteIcon from "../assets/delete.png";

export default function Header({ title }) {
  return (
    <div className="half-screen-header">
      <div className="half-screen-header-text">
        {title}
        <img src={deleteIcon} alt="delete" className="w-6 h-6"></img>
      </div>
      <div className="flex bg-primary"></div>
    </div>
  );
}
