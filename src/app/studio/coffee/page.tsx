import { buildMetadata } from "@/lib/metadata";
import { CoffeeForm } from "./CoffeeForm";

export const metadata = buildMetadata({
  title: "Coffee Chat",
  description: "Request a coffee chat with Husan in Tashkent.",
  path: "/studio/coffee",
});

export default function CoffeePage() {
  return (
    <div className="flex w-full flex-col-reverse items-start gap-6 lg:flex-row lg:gap-8">
      <div className="min-w-0 w-full flex-1">
        <CoffeeForm />
      </div>
      <div className="shrink-0 lg:pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/coffee-cup.png" alt="" className="w-32 sm:w-40 lg:w-48" />
      </div>
    </div>
  );
}
