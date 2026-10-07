import { Breadcrumbs } from "@/components";
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
      <Breadcrumbs
        crumbs={[
          { label: "idk", href: "/studio" },
          { label: "Coffee Chat", href: "/studio/coffee" },
        ]}
      />
      <div className="flex w-full items-start gap-8">
        <div className="min-w-0 flex-1">
          <CoffeeForm />
        </div>
        <div className="hidden w-64 shrink-0 pt-4 lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/coffee-art.png"
            alt=""
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
