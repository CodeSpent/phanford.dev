import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

// Entry Logo Imports
import devstreamsLogo from "../public/images/devstreams-logo.png";
import streamkickLogo from "../public/images/streamkick-logo.jpg";
import robertHalfLogo from "../public/images/robert-half-logo.png";
import twitchinStudiosLogo from "../public/images/twitchin-studios-logo.jpg";

const LogoComponent = (props) => {
  return <img src={props.src} alt="Company logo" />;
};

const ResumeTimeline = () => {
  const resumeEntries = [
    {
      company: "Robert Half SPS",
      title: "Software Engineer",
      description:
        "On the Robert Half SPS team I work with a wide variety of clients with very diverse needs and tech stacks, exposing me to exponential experience and potential to creatively solve problems through consulting, bootstrapping, maintaining, and improving systems. With Robert Half I have offered Docker Swarm consulting, improving cross-platform mobile applications, bootstrapping startup MVPs, rewriting legacy systems, and much more.",
      startDate: "2019",
      endDate: "Present",
      logo: robertHalfLogo.src,
      tags: [
        {
          name: "Django",
          colorClassName: "bg-red-500",
        },
        {
          name: "ReactJS",
          colorClassName: "bg-red-300",
        },
        {
          name: "Postgres",
          colorClassName: "bg-blue-300",
        },
      ],
    },
    {
      company: "DevStreams, LLC",
      title: "Founder",
      description: "Django Developer",
      startDate: "2018",
      endDate: "Present",
      logo: devstreamsLogo.src,
      tags: [
        {
          name: "Django",
          colorClassName: "bg-red-500",
        },
        {
          name: "ReactJS",
          colorClassName: "bg-red-300",
        },
        {
          name: "Postgres",
          colorClassName: "bg-blue-300",
        },
      ],
    },
    {
      company: "StreamKick, LLC",
      title: "Sr. Software Engineer",
      description:
        "StreamKick is a startup based in Orlando, Florida aspiring to bridge the gaps in content discovery within the live-streaming ecosystem. I came into the project to rewrite the MVP from Ruby on Rails to Django & React. After helping to bring the platform to launch, I focused on continuation of features as well as maintaining systems reliability through my DevOps experience.",
      startDate: "2017",
      endDate: "2020",
      logo: streamkickLogo.src,
      tags: [
        {
          name: "Django",
          colorClassName: "bg-blue-800",
        },
        {
          name: "ReactJS",
          colorClassName: "bg-green-900",
        },
        {
          name: "Postgres",
          colorClassName: "bg-teal-800",
        },
      ],
    },

    {
      company: "TwitchinStudios, LLC",
      title: "Co-Founder",
      description:
        "TwitchinStudios was a 3-dev project dedicated to building tools for Twitch streamers to help streamline the content creation process and ultimately augment the streaming experience. In my time with TwitchinStudios, I successfully launched over 14 tools for streamers, 4 of which have been absorbed by StreamLabs and are actively a part of their product features.",
      startDate: "2016",
      endDate: "2019",
      logo: twitchinStudiosLogo.src,
      tags: [
        {
          name: "Django",
          colorClassName: "bg-red-500",
        },
        {
          name: "ReactJS",
          colorClassName: "bg-red-300",
        },
        {
          name: "Postgres",
          colorClassName: "bg-blue-300",
        },
      ],
    },
  ];

  return (
    <VerticalTimeline id="resume" layout={"2-columns"} animate={true}>
      {resumeEntries.map((entry) => (
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={entry.startDate + " - " + entry.endDate}
          icon={<LogoComponent src={entry.logo} />}
        >
          <div className="flex">
            {entry.tags.map((tag) => (
              <span
                className={
                  "mr-1 rounded-full bg-pink-500 p-1 text-xs " +
                  tag.colorClassName
                }
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className={"my-4"}>
            <h1 className="text-xl font-bold text-gray-900">{entry.company}</h1>
            <h3 className="vertical-timeline-element-title font-semibold text-gray-900">
              {entry.title}
            </h3>
            <p />
            <h4 className="vertical-timeline-element-subtitle m-2 text-gray-500">
              {entry.description}
            </h4>
          </div>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default ResumeTimeline;
