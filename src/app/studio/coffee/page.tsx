import { Breadcrumbs } from "@/components";
import { buildMetadata } from "@/lib/metadata";
import { CoffeeArt } from "./CoffeeArt";
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
        <div className="hidden pt-8 lg:block">
          <CoffeeArt />
        </div>
      </div>
    </div>
  );
}
