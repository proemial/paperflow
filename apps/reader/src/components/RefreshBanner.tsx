import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Spinner } from "./spinner";
import { RefreshCw, X } from "lucide-react";
import { Transition } from "@headlessui/react";
import { queryClient } from "../state/react-query";
import dayjs from "dayjs";

export function RefreshBanner({ likes }: { likes?: string[] }) {
  const [hasChanges, setHasChanges] = useState(likes);
  const [open, setOpen] = useState(false);
  const [cancelled, setCancelled] = useState<Date>();

  const { mutate, isLoading } = useMutation((req: {}) => {
    return fetch("/api/feed", {
      method: "POST",
    });
  });

  useEffect(() => {
    const backoff = cancelled && dayjs().diff(dayjs(cancelled), "minutes") < 2;
    if (hasChanges && !backoff) {
      setOpen(true);
    }
    setHasChanges(likes);
  }, [likes]);

  const handleClose = () => {
    setOpen(false);
    setCancelled(new Date());
  };

  const handleUpdate = () => {
    // queryClient.invalidateQueries(["feed"]);
    mutate(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["feed"]);
        },
      }
    );

    setOpen(false);
  };

  return (
    <>
      <Transition
        className="top-0 absolute w-full max-w-[640px]"
        show={open || isLoading}
        enter="transition-all ease-in-out duration-500 delay-[200ms]"
        enterFrom="opacity-0 translate-y-[-36px]"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex justify-between p-2 px-4 bg-gradient-to-r from-secondary to-secondary-gradient shadow w-full">
          {!isLoading && (
            <>
              <div
                className="flex gap-1 items-center h-8 cursor-pointer"
                onClick={handleUpdate}
              >
                <RefreshCw className="h-4" />
                Click here to update your feed
              </div>
              <button type="button" onClick={handleClose}>
                <X />
              </button>
            </>
          )}
          {isLoading && <Spinner />}
        </div>
      </Transition>
    </>
  );
}
