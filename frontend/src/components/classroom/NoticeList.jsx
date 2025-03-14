export default function NoticeList({ notices }) {
  return (
    <div className="flex flex-col gap-4">
      {notices.map((notice, index) => (
        <div key={index} className="text-lg font-medium">
          {notice.title}
          <div className="text-md font-normal text-gray-500">
            {notice.content}
          </div>
        </div>
      ))}
    </div>
  );
}
