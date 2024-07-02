import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form, useNavigation, useSubmit } from "@remix-run/react";

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  onCloseModal,
  title,
  actionText,
  children,
  size,
  handleSubmit,
  ...rest
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCloseModal: () => void;
  title: string;
  actionText: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  handleSubmit: () => void;
}) => {
  // state to handle loading
  const submit = useSubmit();
  const navigation = useNavigation();

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onCloseModal}
      backdrop="opaque"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-3xl dark:bg-slate-900 border-[1px] dark:border-slate-700/20",
      }}
      motionProps={{
        variants: {
          enter: {
            scale: [1, 0.9],
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            scale: [0.9, 1],
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-montserrat font-semibold text-lg text-slate-800 dark:text-white">
              {title}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={onCloseModal}
                className="font-montserrat font-medium"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={navigation.state === "submitting"}
                className="font-montserrat font-medium"
                onPress={handleSubmit}
              >
                {actionText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
