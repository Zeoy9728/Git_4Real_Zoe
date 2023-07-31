import React from "react";

export const Blockquote = ({ children }: React.PropsWithChildren) => {
  return (
    <blockquote className="my-4 rounded-2xl bg-main-sidebar-background p-4">
      {children}
    </blockquote>
  );
};
