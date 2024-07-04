export const ChatBubble = ({
  author,
  time,
  content,
}: {
  author?: string;
  time?: string;
  content: string;
}) => {
  return (
    <div className="w-full">
      <div className="flex gap-2.5">
        <img
          src="https://pagedone.io/asset/uploads/1710412177.png"
          alt="Shanay image"
          className="w-10 h-10"
        />
        <div className="grid">
          <h5 className="text-slate-800 dark:text-white text-sm font-semibold leading-snug pb-1">
            {author}
          </h5>
          <div className="w-max max-w-2xl grid">
            <div
              className="px-3.5 py-2 bg-gray-100 dark:bg-slate-800 rounded-3xl rounded-tl-none justify-start  items-center gap-3 inline-flex flex-wrap text-wrap"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
            <div className="justify-end items-center inline-flex mb-2.5">
              <h6 className="text-gray-500 font-nunito text-xs font-medium leading-4 py-1">
                {time}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
