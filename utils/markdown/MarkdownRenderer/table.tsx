import * as React from "react";
import { useMarkdownRendererProps } from "./types";

export const getTable = ({ serverPath }: useMarkdownRendererProps) => {
  return {
    table: (props: React.TableHTMLAttributes<HTMLTableElement>) => {
      return (
        <div className="table-container">
          <table {...props}>{props.children}</table>
        </div>
      );
    },
  };
};
