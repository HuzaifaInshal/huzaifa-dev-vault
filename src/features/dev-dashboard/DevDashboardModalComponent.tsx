"use client";

import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { ModalProps } from "@/types/common";

const DevDashboardModal = ({
  onOpenChange,
  open,
  className
}: Omit<ModalProps, "children">) => {
  return (
    <Modal
      onOpenChange={onOpenChange}
      open={open}
      className={cn(
        "w-[80dvw] sm:w-[80dvw] max-w-[80dvw] sm:max-w-[80dvw] max-h-[95dvh] items-start justify-start py-6 px-0",
        "w-full h-full flex flex-col items-start gap-3 px-6 max-h-[90dvh] overflow-y-auto custom-scrollbar",
        className
      )}
    >
      <div className="w-full space-y-2">
        <h1>Developer Dashboard</h1>
        <h5>
          This is a dedicated developer surface. Add your debug tools and
          diagnostics here.
        </h5>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-2 gap-4"></div>
    </Modal>
  );
};

export default DevDashboardModal;
