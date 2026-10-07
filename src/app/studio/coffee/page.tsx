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
    <div className="flex w-full flex-col items-start gap-6">
      <div>
        <Breadcrumbs
          crumbs={[
            { label: "idk", href: "/studio" },
            { label: "Coffee Chat", href: "/studio/coffee" },
          ]}
        />
        <p className="mt-4 text-base leading-[1.6] text-gray-600">
          Want to grab a coffee and talk about something interesting? Send me a
          request below. I&apos;ll get back to you on Telegram if I&apos;m in.
        </p>
      </div>
      <CoffeeForm />
    </div>
  );
}
