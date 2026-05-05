"use client";
import { axiosInstance } from "@/services/axios";
import { VoidFunctionWithBooleanArg } from "@/types/common";
import { FocusEventHandler, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// ---------------------------[ Interfaces Prop ]---------------------------

interface Props {
  whiteLIstExtensions?: string[];
  blackListExtensions?: string[];
  onlyImages?: boolean;
  onlyPdf?: boolean;
  onlyVideos?: boolean;
  initialImages?: string[];
  fileMaxSize?: number; // in Mb
  maxFiles?: number; // ✅ Max number of files allowed (default: 10)
  onBlur?: FocusEventHandler<HTMLInputElement>;
  clearSelection?: {
    clearSelection: boolean;
    setClearSelection: VoidFunctionWithBooleanArg;
  };
  setLoading?: VoidFunctionWithBooleanArg; //  sets loading state when uploading
}

interface IFile {
  loading?: boolean;
  url: string | null;
  fileName?: string;
  fileSize?: string;
  uploadProgress?: number | null;
}

export function useUploadMultipleFiles({
  whiteLIstExtensions,
  blackListExtensions,
  onlyImages = false,
  onlyVideos = false,
  onlyPdf = false,
  initialImages,
  fileMaxSize,
  maxFiles = 10,
  onBlur,
  clearSelection,
  setLoading
}: Props) {
  // ---------------------------[ Declarations ]---------------------------

  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>(
    initialImages ? initialImages?.map((each) => ({ url: each })) : []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const PATH = "/upload/files";
  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"];

  useEffect(() => {
    if (clearSelection && clearSelection.clearSelection) {
      setUploadedFiles([]);
      clearSelection.setClearSelection(false);
    }
  }, [clearSelection]);

  // ---------------------------[ Utility Functions ]---------------------------

  function returnAllowedExtension(): string {
    if (onlyImages) return "image/*";
    if (onlyVideos) return "video/*";
    if (onlyPdf) return "application/pdf";
    if (whiteLIstExtensions?.length) {
      return whiteLIstExtensions.map((ext) => `.${ext}`).join(",");
    }
    return "";
  }

  function isFileAllowed(file: File): boolean {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const fileName = file.name;

    if (!ext) {
      toast.error(
        `File "${fileName}" has no extension and cannot be processed`
      );
      return false;
    }

    if (onlyImages && !imageExts.includes(ext)) {
      toast.error(
        `File "${fileName}" is not supported. Only ${imageExts.join(
          ", "
        )} files are allowed`
      );
      return false;
    }

    if (onlyVideos && !videoExts.includes(ext)) {
      toast.error(
        `File "${fileName}" is not supported. Only ${videoExts.join(
          ", "
        )} files are allowed`
      );
      return false;
    }

    if (onlyPdf && file.type !== "application/pdf") {
      toast.error(
        `File "${fileName}" is not a PDF. Only PDF files are allowed.`
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

  function isFileSizeValid(file: File): boolean {
    let maxSizeInBytes = 5 * 1024 * 1024; // Default 5 MB
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
      return false;
    }
    return true;
  }

  function formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  function removeImageAtIndex(src: string | null) {
    setUploadedFiles((prev) => prev.filter((each) => each.url !== src));
  }

  // ---------------------------[ Main Function ]---------------------------

  async function uploadSingleFile(file: File): Promise<IFile | null> {
    const fileEntry: IFile = {
      url: null,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      loading: true,
      uploadProgress: 0
    };

    setUploadedFiles((prev) => [...prev, fileEntry]);

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axiosInstance.postForm(PATH, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadedFiles((prev) =>
              prev.map((each) =>
                each.fileName === file.name
                  ? { ...each, uploadProgress: progress }
                  : each
              )
            );
          }
        }
      });

      const uploadedUrl = response.data.urls?.[0] ?? null;

      setUploadedFiles((prev) =>
        prev.map((each) =>
          each.fileName === file.name
            ? {
                ...each,
                url: uploadedUrl,
                loading: false,
                uploadProgress: null
              }
            : each
        )
      );
      toast.success(`File uploaded successfully, ${file.name}`);

      return {
        ...fileEntry,
        url: uploadedUrl,
        loading: false,
        uploadProgress: null
      };
    } catch {
      setUploadedFiles((prev) =>
        prev.map((each) =>
          each.fileName === file.name
            ? { ...each, loading: false, uploadProgress: null }
            : each
        )
      );
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  }

  //  -------> Handle file change (parallel uploads using Promise.all)
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (uploadedFiles.length + files.length > maxFiles) {
      const remaining = maxFiles - uploadedFiles.length;
      toast.error(
        `You can only upload up to ${maxFiles} files. ${
          maxFiles === remaining
            ? ""
            : `You can add ${remaining < 0 ? 0 : remaining} more.`
        }`
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const allowedFiles = files.filter(isFileAllowed).filter(isFileSizeValid);

    if (allowedFiles.length === 0) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (setLoading) setLoading(true); // NEW: start loading

    await Promise.all(allowedFiles.map((file) => uploadSingleFile(file)));

    if (setLoading) setLoading(false); // NEW: stop loading

    if (inputRef.current) inputRef.current.value = "";
  }

  // ---------------------------[ Exposed input component ]---------------------------

  const Input = (
    <input
      ref={inputRef}
      type="file"
      accept={returnAllowedExtension()}
      multiple={true}
      onChange={handleChange}
      className="hidden"
      onBlur={onBlur}
    />
  );

  // ---------------------------[ Return component ]---------------------------

  return {
    Input,
    uploadedFiles,
    setUploadedFiles,
    triggerFileSelect: () => inputRef.current?.click(),
    removeImageAtIndex
  };
}
