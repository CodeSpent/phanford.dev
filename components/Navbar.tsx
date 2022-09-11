import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChartBarIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, CodeIcon } from "@heroicons/react/solid";
import Link from "next/link";

const projects = [
  {
    name: "DevStreams.io",
    description:
      "Discover streams in your stack with granular search for programming live streams.",
    href: "https://devstreams.io/",
    image: "/images/devstreams-logo.png",
    icon: null,
    unannounced: false,
  },
  {
    name: "GigHire",
    description:
      "Gig-based hiring made simpler, streamlined, and more effective.",
    href: "",
    image: null,
    icon: ChartBarIcon,
    unannounced: true,
  },
  {
    name: "Your Product",
    description:
      "Let's get in touch & add your product to what I'm working on!",
    href: "mailto:patrick@phanford.dev",
    image: null,
    icon: CodeIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  return (
    <Popover className="relative z-40">
      <div className="flex items-center justify-between space-x-10 py-6 sm:px-6 md:justify-start">
        <div className="flex justify-start">
          <Link href="/">
            <a className="flex items-center">
              <img
                className="h-10 w-auto rounded-full sm:h-10"
                src="https://github.com/codespent.png"
                alt="Patrick Hanford profile photo."
              />
              <div className={"mx-2 flex flex-col"}>
                <h1 className="text-2xl text-white">Patrick Hanford</h1>
                <p className={"text-xs italic text-white"}>
                  Web, Mobile, Software, DevOps
                </p>
              </div>
            </a>
          </Link>
        </div>
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white hover:text-white">
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <Popover.Group
          as="nav"
          className="ml-auto hidden space-x-4 md:flex"
          style={{ marginLeft: "auto" }}
        >
          <Link href="/">
            <a className="text-base font-medium text-white hover:text-white">
              Home
            </a>
          </Link>

          <Link href="/blog">
            <a className="text-base font-medium text-white hover:text-white">
              Blog
            </a>
          </Link>

          <Link href="#">
            <a className="text-base font-medium text-white hover:text-white">
              Resume
            </a>
          </Link>
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={classNames(
                    open ? "text-white" : "text-white",
                    "group inline-flex items-center rounded-md bg-transparent text-base font-medium hover:text-white"
                  )}
                >
                  <span>Projects</span>
                  <ChevronDownIcon
                    className={classNames(
                      open ? "text-white" : "text-gray-400",
                      "ml-2 h-5 w-5 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform lg:left-1/2 lg:max-w-2xl lg:-translate-x-1/2">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                        {projects.map((project) => (
                          <a
                            key={project.name}
                            href={project.href}
                            target="_blank"
                            className={
                              "-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50 " +
                              (project.unannounced ? "blur-sm" : "")
                            }
                          >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-white sm:h-12 sm:w-12">
                              {project.image ? (
                                <img
                                  src={project.image}
                                  alt={project.description}
                                />
                              ) : (
                                <project.icon
                                  className="h-10 w-10 text-blue-900"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-900">
                                {project.name}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {project.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="bg-gray-100 p-5 sm:p-8">
                        <a
                          href="#"
                          className="-m-3 flow-root rounded-md p-3 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <div className="text-base font-medium text-gray-900">
                              Github
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Check out my miscellaneous projects on Github!
                          </p>
                        </a>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </Popover.Group>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="fixed inset-x-0 top-0 h-screen origin-top-right transform bg-midnight-blue p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex justify-start">
                  <a className="flex items-center" href="#">
                    <img
                      className="h-10 w-auto rounded-full sm:h-10"
                      src="https://github.com/codespent.png"
                      alt="Patrick Hanford profile photo."
                    />
                    <div className={"mx-2 flex flex-col"}>
                      <h1 className="text-2xl text-white">Patrick Hanford</h1>
                      <p className={"text-xs italic text-white"}>
                        Web, Mobile, Software, DevOps
                      </p>
                    </div>
                  </a>
                </div>

                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 hover:text-white">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid grid-cols-1 gap-7">
                  <div className="py-6 px-5">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <a
                        href="/"
                        className="text-base font-medium text-white hover:text-gray-700"
                      >
                        Home
                      </a>

                      <a
                        href="blog"
                        className="text-base font-medium text-white hover:text-gray-700"
                      >
                        Blog
                      </a>

                      <a
                        href="#"
                        className="text-base font-medium text-white hover:text-gray-700"
                      >
                        Resume
                      </a>
                    </div>
                  </div>

                  <span className="text-white">Projects</span>
                  {projects.map((project) => (
                    <a
                      key={project.name}
                      href={project.href}
                      target="_blank"
                      className={
                        "relative -m-3 rounded-lg bg-gray-50 p-3 text-white"
                      }
                    >
                      {project.unannounced && (
                        <div className="absolute right-0 left-0 m-0 h-full w-full p-2 text-center text-gray-900">
                          <h1 className="text-lg font-bold">Stay Tuned!</h1>
                          <p className="font-semibold">
                            This project is coming soon.
                          </p>
                        </div>
                      )}
                      <div
                        className={
                          "flex items-center " +
                          (project.unannounced ? "blur-sm" : "")
                        }
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-white">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.description}
                            />
                          ) : (
                            <project.icon
                              className="h-6 w-6 text-blue-900"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="ml-4 text-base font-medium text-gray-900">
                          {project.name}

                          <p className="mt-1 text-sm text-gray-500">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
