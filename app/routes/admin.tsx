import Header from "~/components/sections/header";

export default function AdminLayout() {
  return (
    <div className="h-screen bg-slate-300/20 dark:bg-slate-950 flex relative overflow-y-auto vertical-scrollbar">
      {/* sidebar */}
      <div className="w-[17%]">
        <div className="fixed top-0 left-0 h-screen w-[17%] bg-blue-600"></div>
      </div>

      {/* page content */}
      <div className="flex-1">
        <Header pageTitle="Dashboard" />
      </div>
    </div>
  );
}
