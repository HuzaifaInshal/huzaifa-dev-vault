"use client";

import { axiosInstance } from "@/services/axios";
import { VoidFunctionWithStringArg } from "@/types/common";
import { FocusEventHandler, useRef, useState } from "react";
import toast from "react-hot-toast";

// ---------------------------[ Interfaces Prop ]---------------------------

interface Props {
  whiteLIstExtensions?: string[];
  blackListExtensions?: string[];
  onlyImages?: boolean;
  onlyVideos?: boolean;
  setValue: VoidFunctionWithStringArg;
  fileMaxSize?: number; // in Mb
  onBlur?: FocusEventHandler<HTMLInputElement>;
  inputId?: string;
}

export function useUploadFile({
  whiteLIstExtensions,
  blackListExtensions,
  onlyImages = false,
  onlyVideos = false,
  setValue,
  fileMaxSize,
  onBlur,
  inputId
}: Props) {
  // ---------------------------[ State & Refs ]---------------------------

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const PATH = "/upload/files";
  const imageExts = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg"
    //  "bmp",
    // "tiff"
  ];
  const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"];

  // ---------------------------[ Utility Functions ]---------------------------

  //  -------> Utility: get accepted file extensions
  function returnAllowedExtension(): string {
    if (onlyImages) return "image/*";
    if (onlyVideos) return "video/*";
    if (whiteLIstExtensions?.length) {
      return whiteLIstExtensions.map((ext) => `.${ext}`).join(",");
    }
    return "";
  }

  // -------> Enhanced Utility: validate file extension with toast notifications
  function isFileAllowed(file: File): boolean {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const fileName = file.name;

    if (!ext) {
      toast.error(
        `File "${fileName}" has no extension and cannot be processed`
      );
      return false;
    }

    // ✅ Image check
    if (onlyImages && !imageExts.includes(ext)) {
      toast.error(
        `File "${fileName}" is not supported. Only ${imageExts.join(
          ", "
        )} files are allowed`
      );
      return false;
    }

    // ✅ Video check
    if (onlyVideos && !videoExts.includes(ext)) {
      toast.error(
        `File "${fileName}" is not supported. Only ${videoExts.join(
          ", "
        )} files are allowed`
      );
      return false;
    }

    if (whiteLIstExtensions && !whiteLIstExtensions.includes(ext)) {
      const allowedExts = whiteLIstExtensions.join(", ");
      toast.error(
        `File "${fileName}" has unsupported extension ".${ext}". Allowed extensions: ${allowedExts}`
      );
      return false;
    }

    if (blackListExtensions && blackListExtensions.includes(ext)) {
      toast.error(
        `File "${fileName}" has forbidden extension ".${ext}" and cannot be uploaded`
      );
      return false;
    }

    return true;
  }

  // --------> Enhanced Utility: validate file size with toast notifications
  function isFileSizeTooLarge(file: File): boolean {
    let maxSizeInBytes = 5 * 1024 * 1024; // Default 5 MB in bytes
    if (fileMaxSize) {
      maxSizeInBytes = fileMaxSize * 1024 * 1024;
    }
    const fileName = file.name;
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeInMB = (maxSizeInBytes / (1024 * 1024)).toFixed(2);
    if (file.size > maxSizeInBytes) {
      toast.error(
        `File "${fileName}" is too large (${fileSizeInMB} MB). Maximum allowed size: ${maxSizeInMB} MB`
      );
      return true;
    }
    return false;
  }

  // ---------------------------[ Upload Function ]---------------------------

  async function uploadFile(file: File): Promise<string[] | null> {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("files", file);

      const response = await axiosInstance.postForm(PATH, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          } else {
            setUploadProgress(null);
          }
        }
      });

      setUploadProgress(null);
      return response.data.urls as string[];
    } catch {
      setUploadProgress(null);
      toast.error("Failed to upload file.");
      return null;
    } finally {
      if (inputRef?.current) {
        inputRef.current.value = "";
      }
      setIsUploading(false);
    }
  }

  // ---------------------------[ Handle File Input Change ]---------------------------

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFileAllowed(file)) {
      return;
    }

    if (isFileSizeTooLarge(file)) {
      return;
    }

    const url = await uploadFile(file);
    if (url) setValue(url[0]);
  }

  // ---------------------------[ Exposed Input Element ]---------------------------

  const Input = (
    <input
      ref={inputRef}
      type="file"
      accept={returnAllowedExtension()}
      multiple={false}
      onChange={handleChange}
      className="hidden"
      onBlur={onBlur}
      id={inputId}
    />
  );

  // ---------------------------[ Hook Return ]---------------------------

  return {
    Input,
    uploadProgress,
    isUploading,
    triggerFileSelect: () => inputRef.current?.click()
  };
}
