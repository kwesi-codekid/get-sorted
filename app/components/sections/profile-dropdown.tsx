import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { UserInterface } from "~/utils/types";

export default function ProfileDropdown({ user }: { user?: UserInterface }) {
  return (
    <Dropdown
      placement="bottom-start"
      size="sm"
      className="dark:bg-slate-800"
      backdrop="opaque"
    >
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            className: "!bg-transparent",
            fallback: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 32 32"
                className="size-5 text-white"
              >
                <path
                  fill="none"
                  d="M8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0M20.5 12.5A4.5 4.5 0 1 1 16 8a4.5 4.5 0 0 1 4.5 4.5"
                ></path>
                <path
                  fill="currentColor"
                  d="M26.749 24.93A13.99 13.99 0 1 0 2 16a13.9 13.9 0 0 0 3.251 8.93l-.02.017c.07.084.15.156.222.239c.09.103.187.2.28.3q.418.457.87.87q.14.124.28.242q.48.415.99.782c.044.03.084.069.128.1v-.012a13.9 13.9 0 0 0 16 0v.012c.044-.031.083-.07.128-.1q.51-.368.99-.782q.14-.119.28-.242q.451-.413.87-.87c.093-.1.189-.197.28-.3c.071-.083.152-.155.222-.24ZM16 8a4.5 4.5 0 1 1-4.5 4.5A4.5 4.5 0 0 1 16 8M8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0"
                ></path>
              </svg>
            ),
            size: "sm",
          }}
          className="transition-transform"
          description={
            <p className="hidden md:block text-slate-200 font-nunito">
              {user?.email}
            </p>
          }
          name={
            <p className="hidden md:block font-nunito font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </p>
          }
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold font-montserrat">Signed in as</p>
          <p className="font-bold font-nunito capitalize">@{user?.role}</p>
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          variant="flat"
          // onClick={() => logoutDisclosure.onOpen()}
          className=""
        >
          <div className="flex items-center gap-2 text-red-500 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="size-4"
            >
              <path
                fill="currentColor"
                d="M11 12V4q0-.425.288-.712T12 3t.713.288T13 4v8q0 .425-.288.713T12 13t-.712-.288T11 12m1 9q-1.85 0-3.488-.712T5.65 18.35t-1.937-2.863T3 12q0-1.725.638-3.312T5.425 5.85q.275-.3.7-.3t.725.3q.275.275.25.688t-.3.737q-.85.95-1.325 2.163T5 12q0 2.9 2.05 4.95T12 19q2.925 0 4.963-2.05T19 12q0-1.35-.475-2.588t-1.35-2.187q-.275-.3-.288-.7t.263-.675q.3-.3.725-.3t.7.3q1.175 1.25 1.8 2.838T21 12q0 1.85-.712 3.488t-1.925 2.862t-2.85 1.938T12 21"
              ></path>
            </svg>
            Log Out
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
