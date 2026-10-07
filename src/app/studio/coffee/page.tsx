import { Breadcrumbs } from "@/components";
import { buildMetadata } from "@/lib/metadata";
import { CoffeeForm } from "./CoffeeForm";

export const metadata = buildMetadata({
  title: "Coffee Chat | idk | Husan Isomiddinov",
  description: "Request a coffee chat with Husan in Tashkent.",
  path: "/studio/coffee",
});

const ART = [
  { src: "/images/coffee-art.png", className: "right-4 top-12 w-48", alt: "" },
  { src: "/images/coffee-globe.png", className: "-left-4 top-64 w-24 opacity-40", alt: "" },
  { src: "/images/coffee-philosophy.png", className: "-right-4 top-[380px] w-36 opacity-30 rounded-lg", alt: "" },
  { src: "/images/coffee-ottoman.png", className: "left-12 bottom-16 w-32 opacity-40 rounded-lg", alt: "" },
  { src: "/images/coffee-astronomers.png", className: "right-8 bottom-8 w-36 opacity-45", alt: "" },
] as const;

export default function CoffeePage() {
  return (
    <div className="relative flex w-full flex-col items-start gap-4 overflow-hidden lg:min-h-[700px]">
      <Breadcrumbs
        crumbs={[
          { label: "idk", href: "/studio" },
          { label: "Coffee Chat", href: "/studio/coffee" },
        ]}
      />
      <div className="relative z-10 w-full max-w-lg">
        <CoffeeForm />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        {ART.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`absolute ${img.className}`}
          />
        ))}
      </div>
    </div>
  );
}
