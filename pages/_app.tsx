import React, { Fragment, useEffect, useState } from "react";
import { AppProps } from "next/app";
import Particles from "react-tsparticles";
import { Transition } from "@headlessui/react";
import "../styles/index.css";
import "../global.scss";
import AnnouncementBanner from "../components/AnnouncementBanner";

function AppComponent({ Component, pageProps }: AppProps) {
  const [announcementVisible, setAnnouncementVisible] = useState(false);

  const closeAnnouncementBanner = () => {
    setAnnouncementVisible(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setAnnouncementVisible(true);
    }, 1500);
  }, [setAnnouncementVisible]);

  return (
    <Fragment>
      <Particles
        id="particles"
        options={{
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: false,
                mode: "push",
              },
              onHover: {
                enable: false,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: false,
              value: 2,
            },
          },
          detectRetina: true,
        }}
      />
      <Transition
        as="div"
        show={announcementVisible}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0 top-0"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="fixed z-50 w-full"
      >
        {/* <AnnouncementBanner
          color="warning"
          shortMessage="Site incomplete! Bugs ahead."
          longMessage="You're early! I'm still actively building this site. Bugs ahead."
          linkText="Report an issue"
          linkHref="https://github.com/CodeSpent/phanford.dev/issues"
          announcementDate="Aug 21, 2020 at 11:52 am (EST)"
          onClose={closeAnnouncementBanner}
        />*/}
      </Transition>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default AppComponent;
