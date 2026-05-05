"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import DevDashboardModal from "./DevDashboardModalComponent";

const DevDashboardProvder = () => {
  const [openDevDashboard, setOpenDevDashboard] = useState(false);
  const keySequenceStepRef = useRef(0);
  const sequenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keySequence = ["k", "v"];

  useEffect(() => {
    const clearSequenceTimer = () => {
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current);
        sequenceTimeoutRef.current = null;
      }
    };

    const resetSequence = () => {
      keySequenceStepRef.current = 0;
      clearSequenceTimer();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key?.toLowerCase();
      const isCtrlShift = event.ctrlKey && event.shiftKey;

      if (!isCtrlShift) {
        return;
      }

      const expectedKey = keySequence[keySequenceStepRef.current];

      if (pressedKey === expectedKey) {
        keySequenceStepRef.current += 1;
        clearSequenceTimer();
        sequenceTimeoutRef.current = setTimeout(() => {
          keySequenceStepRef.current = 0;
          sequenceTimeoutRef.current = null;
        }, 5000);

        if (keySequenceStepRef.current === keySequence.length) {
          setOpenDevDashboard(true);
          resetSequence();
        }
        return;
      }

      resetSequence();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearSequenceTimer();
    };
  }, []);

  return (
    <Fragment>
      {openDevDashboard ? (
        <DevDashboardModal
          open={openDevDashboard}
          onOpenChange={setOpenDevDashboard}
        />
      ) : null}
    </Fragment>
  );
};

export default DevDashboardProvder;
