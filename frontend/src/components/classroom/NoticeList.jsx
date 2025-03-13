export default function NoticeList({ notices }) {
  return (
    <div className="flex flex-col gap-2">
      {notices.map((notice, index) => (
        <div key={index} className="text-lg font-medium">
          {notice.title}
        </div>
      ))}
    </div>
  );
}
