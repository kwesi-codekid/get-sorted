import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { ArrowLeftAnimated } from "~/components/icons/arrows";
import { Card, IconCard } from "~/components/sections/cards";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { UserInterface } from "~/utils/types";
import avatar from "~/assets/illustrations/avatar.jpg";

export default function StaffProfile() {
  const [storedValue] = useLocalStorage<
    | {
        token: string;
        user: UserInterface;
      }
    | string
  >("auth-token", "");
  const navigate = useNavigate();

  return (
    <main className="h-full grid grid-cols-3 gap-6">
      <div className="dark:bg-slate-900 dark:border border-white/5 rounded-2xl p-3 bg-white flex flex-col gap-4 h-max">
        <Button
          size="sm"
          variant="flat"
          color="default"
          startContent={<ArrowLeftAnimated className="size-3.5" />}
          onClick={() => navigate(-1)}
          className="w-max font-nunito"
        >
          Back to tickets
        </Button>

        <div className="flex items-start gap-3">
          <div className="rounded-full">
            <img src={avatar} alt="avatar" className="size-20 rounded-full" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h3 className="font-montserrat font-semibold text-2xl mb-2">
              {storedValue?.user.firstName} {storedValue?.user.lastName}
            </h3>
            <p className="text-xs font-nunito">{storedValue?.user?.staffId}</p>
            <p className="text-xs font-nunito">{storedValue?.user?.email}</p>
            <p className="text-xs font-nunito">{storedValue?.user?.phone}</p>
          </div>
        </div>
      </div>

      {/* ticket comments */}
      <div className="dark:bg-slate-900 dark:border border-white/5 rounded-2xl p-3 pt-2 bg-white flex flex-col gap-4 col-span-2 justify-end">
        {/* comment list */}
      </div>
    </main>
  );
}
