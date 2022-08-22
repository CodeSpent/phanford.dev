import { XIcon } from "@heroicons/react/outline";

type Props = {
  shortMessage: string;
  longMessage: string;
  linkText?: string;
  linkHref?: string;
  /* TODO: `color` could be validated with PropTypes. */
  color?: string;
  announcementDate: string;
  onClose: () => void;
};

const getBackgroundColorClassName = (color: string): string => {
  switch (color) {
    case "danger":
      return "bg-red-500";
    case "warning":
      return "bg-orange-500";
    case "positive":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export default function AnnouncementBanner({
  color,
  shortMessage,
  longMessage,
  linkText,
  linkHref,
  announcementDate,
  onClose,
}: Props) {
  return (
    <div className={"w-full " + getBackgroundColorClassName(color)}>
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:px-16 sm:text-center">
          <p className="font-medium text-white">
            <span className="md:hidden">{shortMessage}</span>
            <span className="hidden md:inline">{longMessage}</span>
            <span className="block sm:ml-2 sm:inline-block">
              <a href={linkHref} className="font-bold text-white underline">
                {" "}
                {linkText} <span aria-hidden="true">&rarr;</span>
              </a>
            </span>
          </p>

          <p className="mt-1 text-xs font-medium text-gray-300 sm:text-center">
            Announced: {announcementDate}
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:items-start sm:pt-1 sm:pr-2">
          <button
            type="button"
            className="flex rounded-md p-2"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
