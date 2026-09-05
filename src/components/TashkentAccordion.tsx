"use client";

import * as Accordion from "@radix-ui/react-accordion";
import type { DiningCategory } from "@/types";
import { ChevronDownIcon } from "@/components/icons";

export function TashkentAccordion({ categories }: { categories: DiningCategory[] }) {
  return (
    <Accordion.Root type="multiple" className="w-full">
      {categories.map((section) => (
        <Accordion.Item
          key={section.category}
          value={section.category}
          className="border-0 border-b border-gray-300"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center gap-2 py-3 text-left">
              <span className="flex-1 font-sans text-base font-bold text-gray-800">
                {section.category}
              </span>
              <ChevronDownIcon className="shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4">
            <div className="flex w-full flex-col items-start gap-4">
              {section.places.map((place) => (
                <div key={place.name} className="w-full">
                  <p className="font-sans text-base font-bold text-gray-800">
                    {place.name}
                  </p>
                  <p className="text-base text-gray-600">{place.description}</p>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
