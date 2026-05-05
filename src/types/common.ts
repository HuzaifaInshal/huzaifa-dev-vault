import React, { Dispatch, SetStateAction } from "react";

type AnyBase = string | boolean | null | number | undefined;

export type Any = AnyBase | Record<string, AnyBase>;

export type DynamicObject = {
  [key: string]: string;
};

export type LabelValuePair = {
  label: string;
  value: string;
};

export type LabelElementValuePair = {
  label: string | React.ReactNode;
  value: string;
};

export type StringOrNum = string | number;

export type ReactDispatch<T> = Dispatch<SetStateAction<T>>;

export type VoidFunctionWithTArg<T> = (_args: T) => void;

export type TFunctionWithYArg<Y, T> = (_args: Y) => T;

export type VoidFunctionWithBooleanArg = (_args: boolean) => void;

export type VoidFunction = () => void;

export type PromiseVoidFunction = () => Promise<void>;

export type VoidFunctionWithStringArg = (_args: string) => void;

export type StringFunctionWithStringArg = (_args: string) => string;

export type VoidFunctionWithNumberArg = (_args: number) => void;

export type VoidFunctionWithArrayOfStringArg = (_args: string[]) => void;

export type VoidFunctionWithStringOrNullArg = (_args: string | null) => void;

export type VoidFunctionWithArrayOfStringOrStringArg = (
  _args: string | string[]
) => void;

export type DynamicObjectWithObject = {
  [key: string]: string | DynamicObjectWithObject;
};

export type MouseClickEvent = TFunctionWithYArg<
  React.MouseEvent<HTMLButtonElement, MouseEvent>,
  void
>;

export interface ModalProps {
  onOpenChange: VoidFunctionWithBooleanArg;
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface PaginationRes {
  pagination: IPagination;
}

export interface IPagination {
  lastPage: number;
  limit: number;
  nextPage: number | null;
  page: number;
  prevPage: number | null;
  total: number;
  totalPages: number;
}

export interface PaginationReq {
  limit: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export interface ConfirmModalProps {
  title: string;
  description: (string | React.ReactNode)[];
  imageType: "none" | "success" | "error";
  cancelText?: string;
  confirmText?: string;
  isPending: boolean;
  cancelClick: MouseClickEvent;
  confirmClick: MouseClickEvent;
  open: boolean;
  onOpenChange?: VoidFunctionWithBooleanArg;
}

export interface AlertModalProps {
  title: string;
  description: (string | React.ReactNode)[];
  imageType: "none" | "success" | "error";
  confirmText?: string;
  confirmClick: MouseClickEvent;
  open: boolean;
  showCloseButton?: boolean;
  onOpenChange?: VoidFunctionWithBooleanArg;
}

export interface IRecommendedSize {
  width: number;
  height: number;
}
