import { Button } from "@nextui-org/react";
import { AnimatedEditIcon } from "../icons/edit";
import { DeleteOutlinedAnimatedIcon } from "../icons/delete";

export const EditButton = ({ action }: { action: () => void }) => (
  <Button
    size="sm"
    variant="flat"
    color="primary"
    startContent={<AnimatedEditIcon className="size-3.5" />}
    onClick={action}
  >
    Edit
  </Button>
);

export const DeleteButton = ({ action }: { action: () => void }) => (
  <Button
    size="sm"
    variant="flat"
    color="danger"
    startContent={<DeleteOutlinedAnimatedIcon className="size-3.5" />}
    onClick={action}
  >
    Trash
  </Button>
);
