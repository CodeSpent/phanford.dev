import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const taglines = [
  "Software",
  "Web Applications",
  "Websites",
  "Native Apps",
  "REST APIs",
  "Automation Tools",
  "Battle Roombas",
  "Schemas",
  "GraphQL APIs",
  "CI/CD Pipelines",
  "Clusters",
  "Aggregators",
  "Interfaces",
  "Cross-platform apps",
  "Infrastructure",

  // Landing tagline remains as last element
  "Solutions",
];

const HeroComponent = () => {
  const [tagline, setTagline] = useState("Solutions");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex + 1 != taglines.length)
        setCurrentIndex(currentIndex + 1);
      setTagline(taglines[currentIndex]);
    }, 250);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="flex flex-col px-6 py-12 leading-6 tracking-widest">
      <div className="min-h-max" style={{ minHeight: "200px" }}>
        <span className="text-lg font-thin italic text-teal-500">
          Hi, my name is
        </span>
        <h1 className="text-6xl text-white lg:text-9xl">Patrick</h1>

        <Transition
          enter-active-class="transition-opacity duration-75"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          show={true}
        >
          <h2 className="text-4xl font-thin text-gray-500 lg:text-6xl">
            I build{" "}
            <span className="font-bold italic text-yellow-500">{tagline}</span>
          </h2>
        </Transition>
      </div>

      <p className="mt-4 max-w-lg rounded bg-black-glass px-4 py-6 font-thin backdrop-blur-sm lg:max-w-4xl">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English. Many desktop publishing packages and web
        page editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).
      </p>

      <a className="mt-20 flex flex-col items-center justify-center p-4">
        <ChevronDownIcon
          className="mr-1 h-8 w-8 animate-bounce text-white group-hover:text-white"
          aria-hidden="true"
        />
      </a>
    </div>
  );
};

export default HeroComponent;
