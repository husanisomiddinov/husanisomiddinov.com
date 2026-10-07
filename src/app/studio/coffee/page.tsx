import { buildMetadata } from "@/lib/metadata";
import { CoffeeForm } from "./CoffeeForm";

export const metadata = buildMetadata({
  title: "Coffee Chat | idk | Husan Isomiddinov",
  description: "Request a coffee chat with Husan in Tashkent.",
  path: "/studio/coffee",
});

export default function CoffeePage() {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-start gap-8">
        <div className="min-w-0 flex-1">
          <CoffeeForm />
        </div>
        <div className="hidden shrink-0 pt-8 lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/coffee-cup.png"
            alt=""
            className="w-48"
          />
        </div>
      </div>
    </div>
  );
}
