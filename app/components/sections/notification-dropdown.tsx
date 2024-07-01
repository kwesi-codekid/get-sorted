import {
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Skeleton,
} from "@nextui-org/react";
import { BellFilledIcon } from "../icons/bell";
import { useState } from "react";

export default function NotificationDropdown({
  primaryColor,
  secondaryColor,
  icon,
  title,
  description,
}: {
  primaryColor?: string;
  secondaryColor?: string;
  icon?: string;
  title?: string;
  description?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Popover placement="bottom-end" size="sm" backdrop="opaque">
      <PopoverTrigger>
        <Button
          size="sm"
          variant="light"
          className="!bg-transparent"
          disableRipple
        >
          <Badge content="" color="danger" isDot>
            <BellFilledIcon className="size-5 text-white" />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label="Notifications"
        className="dark:bg-slate-800 w-80 py-2 px-3  flex items-start flex-col"
      >
        <div className="px-3 py-2 flex items-start gap-1 w-full">
          <Skeleton
            isLoaded={!isLoading}
            className="rounded-full dark:bg-slate-700"
          >
            <div
              className={`rounded-full size-10 flex items-center justify-center ${secondaryColor}`}
            >
              <p className={primaryColor}>{icon}</p>
            </div>
          </Skeleton>

          <div className="flex flex-col flex-1 gap-1">
            <Skeleton
              isLoaded={!isLoading}
              className={`rounded-lg w-full dark:bg-slate-700 h-5 pl-2`}
            >
              <h4 className="text-slate-700 dark:text-white text-base font-nunito font-bold">
                {description}
              </h4>
            </Skeleton>
            <Skeleton
              isLoaded={!isLoading}
              className={`rounded-lg w-full dark:bg-slate-700 h-3 pl-2`}
            >
              <h4 className="text-slate-700 dark:text-white text-base font-nunito font-bold">
                {description}
              </h4>
            </Skeleton>
          </div>
        </div>
        <div className="px-3 py-2 flex items-start gap-1 w-full">
          <Skeleton
            isLoaded={!isLoading}
            className="rounded-full dark:bg-slate-700"
          >
            <div
              className={`rounded-full size-10 flex items-center justify-center ${secondaryColor}`}
            >
              <p className={primaryColor}>{icon}</p>
            </div>
          </Skeleton>

          <div className="flex flex-col flex-1 gap-1">
            <Skeleton
              isLoaded={!isLoading}
              className={`rounded-lg w-full dark:bg-slate-700 h-5 pl-2`}
            >
              <h4 className="text-slate-700 dark:text-white text-base font-nunito font-bold">
                {description}
              </h4>
            </Skeleton>
            <Skeleton
              isLoaded={!isLoading}
              className={`rounded-lg w-full dark:bg-slate-700 h-3 pl-2`}
            >
              <h4 className="text-slate-700 dark:text-white text-base font-nunito font-bold">
                {description}
              </h4>
            </Skeleton>
          </div>
        </div>
        <div className="px-3 py-2 flex items-start gap-1 w-full">
          <Skeleton
            isLoaded={!isLoading}
            className="rounded-full dark:bg-slate-700"
          >
            <div
              className={`rounded-full size-10 flex items-center justify-center ${secondaryColor}`}
            >
              <p className={primaryColor}>{icon}</p>
            </div>
          </Skeleton>

          <div className="flex flex-col flex-1 gap-1">
            <Skeleton
              isLoaded={!isLoading}
              className={`rounded-lg w-full dark:bg-slate-700 h-5 pl-2`}
            >
              <h4 className="text-slate-700 dark:text-white text-base font-nunito font-bold">
                {description}
              </h4>
            </Skeleton>
            <Skeleton
              isLoaded={!isLoading}
              className={`rounded-lg w-full dark:bg-slate-700 h-3 pl-2`}
            >
              <h4 className="text-slate-700 dark:text-white text-base font-nunito font-bold">
                {description}
              </h4>
            </Skeleton>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
