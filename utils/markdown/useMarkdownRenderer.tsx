import * as React from "react";
import {unified} from "unified";
import rehypeParse from "rehype-parse";
import reactRehyped from "rehype-react";
import {ReactElement, ReactNode} from "react";
import {
  getHeadings,
  getMedia,
  getLinks,
  getTabs,
  getTable,
} from "./MarkdownRenderer";
import {useMarkdownRendererProps} from "./MarkdownRenderer/types";
import {ComponentsWithNodeOptions} from "rehype-react/lib/complex-types";
import {MarkdownDataProvider} from "../markdown/MarkdownRenderer/data-context";

type ComponentMap = ComponentsWithNodeOptions["components"];

const TabHeader: React.FC = ({children}) => {
  return <>{children}</>;
};

TabHeader.displayName = "TabHeader";

const getComponents = (
  props: useMarkdownRendererProps,
  comps: ComponentMap = {}
) => {
  return {
    html: ({children}: { children: ReactNode[] }) => <>{children}</>,
    body: ({children}: { children: ReactNode[] }) => <>{children}</>,
    head: ({children}: { children: ReactNode[] }) => <>{children}</>,
    ...getTable(props),
    ...getTabs(props),
    ...getHeadings(props),
    ...getMedia(props),
    ...getLinks(props),
    ...comps,
  };
};

export const useMarkdownRenderer = (
  props: useMarkdownRendererProps,
  comps: ComponentMap = {}
) => {
  const result = React.useMemo(
    () =>
      unified()
        .use(rehypeParse)
        .use(reactRehyped, {
          createElement: React.createElement,
          components: getComponents(props, comps) as any,
        })
        .processSync(props.markdownHTML).result as ReactElement,
    [comps, props]
  );

  return <MarkdownDataProvider>{result}</MarkdownDataProvider>;
};
