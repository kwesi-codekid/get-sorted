import { ReactNode } from "react";
import { MoonIcon } from "../icons/theme";

export const Card = ({
  children,
  title,
}: {
  children?: ReactNode;
  title: string;
}) => {
  return (
    <div className="h-full dark:bg-slate-900 dark:border border-white/5 rounded-2xl p-3 pt-2 bg-white">
      <h4 className="font-montserrat font-medium text-slate-800 dark:text-white">
        {title}
      </h4>
      {children}
    </div>
  );
};

export const IconCard = ({
  children,
  title,
}: {
  children?: ReactNode;
  title: string;
}) => {
  return (
    <div className="h-full dark:bg-slate-900 dark:border border-white/5 rounded-2xl p-3 py-4 bg-white relative overflow-hidden">
      <h4 className="font-montserrat font-medium text-slate-800 dark:text-white text-sm">
        {title}
      </h4>
      {children}
      <div className="absolute -bottom-3 -right-3">
        <MoonIcon className="text-7xl opacity-5" />
      </div>
    </div>
  );
};
