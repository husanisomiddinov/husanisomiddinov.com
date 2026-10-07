import Image from "next/image";
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
        <div className="hidden w-56 shrink-0 pt-4 lg:block">
          <Image
            src="/images/coffee-art.png"
            alt=""
            width={400}
            height={700}
            className="w-full rounded-lg opacity-80"
            priority
          />
        </div>
      </div>
    </div>
  );
}
