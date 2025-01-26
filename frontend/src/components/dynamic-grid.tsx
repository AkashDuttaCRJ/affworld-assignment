import React from "react";

interface GridLayoutProps {
  children: React.ReactNode;
}

export default function DynamicGrid({ children }: GridLayoutProps) {
  const getGridClass = (itemCount: number) => {
    switch (itemCount) {
      case 2:
        return "grid-cols-2 grid-rows-1 [&>*]:aspect-[3/4]";
      case 3:
        return "grid-cols-2 grid-rows-2 [&>*:first-child]:row-span-2 [&>*:not(:first-child)]:aspect-[4/3]";
      case 4:
        return "grid-cols-2 grid-rows-2 [&>*]:aspect-[4/3]";
      default:
        return "grid-cols-1 grid-rows-1";
    }
  };

  return (
    <div
      className={`grid gap-0.5 rounded-md overflow-hidden ${getGridClass(
        React.Children.toArray(children).length
      )}`}
    >
      {children}
    </div>
  );
}
