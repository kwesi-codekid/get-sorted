import { Button } from "@nextui-org/react";
import { AnimatedEditIcon } from "../icons/edit";
import { DeleteOutlinedIcon } from "../icons/delete";

export const EditButton = ({ action }: { action: () => void }) => (
  <Button
    size="sm"
    variant="flat"
    color="primary"
    startContent={<AnimatedEditIcon />}
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
    startContent={<DeleteOutlinedIcon />}
    onClick={action}
  >
    Trash
  </Button>
);
