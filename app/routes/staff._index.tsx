import { Card, IconCard } from "~/components/sections/cards";

export default function AdminDashboard() {
  const data = [
    { title: "Total Members", value: 12 },
    { title: "Total Tickets", value: 12 },
    { title: "Total Stats", value: 12 },
  ];
  return (
    <div className="h-full grid grid-cols-3 gap-8">
      {/* left-sided cards */}
      <div className="col-span-2 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {/* stats card */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((idx, index) => (
              <IconCard key={index} title={data[idx]?.title as string}>
                <p className="font-nunito text-2xl font-semibold">
                  {data[idx]?.value}
                </p>
              </IconCard>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {data.map((data, index) => (
              <IconCard key={index} title={data.title}>
                <p className="font-nunito text-2xl font-semibold">
                  {data.value}
                </p>
              </IconCard>
            ))}
          </div>
        </div>

        {/* chart */}
        <Card title="Analytics" />
      </div>

      {/* right-sided cards */}
      <div className="flex flex-col gap-6 h-full">
        <Card title="Recents" />
        <Card title="Recents" />
      </div>
    </div>
  );
}
