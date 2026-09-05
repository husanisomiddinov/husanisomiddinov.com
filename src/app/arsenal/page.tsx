import { getArsenal } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Arsenal | Husan Isomiddinov",
  description: "The software and hardware I rely on day to day.",
  path: "/arsenal",
});

export default function ArsenalPage() {
  const arsenal = getArsenal();

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="w-full">
        <p className="mb-4 font-sans text-sm font-semibold text-gray-500">Software</p>
        <div className="flex w-full flex-col items-start gap-4">
          {arsenal.software.map((item) => (
            <div key={item.name} className="w-full">
              <p className="font-sans text-base font-bold text-gray-800">{item.name}</p>
              <p className="text-base text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="w-full border-gray-300" />

      <div className="w-full">
        <p className="mb-4 font-sans text-sm font-semibold text-gray-500">Hardware</p>
        <div className="flex w-full flex-col items-start gap-4">
          {arsenal.hardware.map((item) => (
            <div key={item.name} className="w-full">
              <p className="font-sans text-base font-bold text-gray-800">{item.name}</p>
              <p className="text-base text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
