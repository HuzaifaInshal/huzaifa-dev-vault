"use client";
import { useState, Dispatch, SetStateAction } from "react";

export const useBooleanState = (defaultValue?: boolean) => {
  const [internalState, setInternalState] = useState<boolean>(
    defaultValue || false,
  );

  const onTrue = () => setInternalState(true);
  const onFalse = () => setInternalState(false);
  const onToggle = () => setInternalState((prev) => !prev);

  return [internalState, setInternalState, onTrue, onFalse, onToggle] as [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    () => void,
    () => void,
  ];
};
