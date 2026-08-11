import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import type { ProductFormValues } from "@/types/products/products.type";
import { deleteImageAction } from "@/actions/products/delete-image.action";
import { uploadImageAction } from "@/actions/products/upload-image.action";

interface Props {
  publicId: string | undefined;
  setPublicId: Dispatch<SetStateAction<string | undefined>>;
  imagePreview: string | undefined;
  setImagePreview: Dispatch<SetStateAction<string | undefined>>;
  form: UseFormReturn<ProductFormValues>;
}

export default function UploadImage({
  form,
  publicId,
  setPublicId,
  imagePreview,
  setImagePreview,
}: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: uploadImageAction,
    onError: (error: TypeError) => toast.error(error.message),
    onSuccess: (data) => {
      setImagePreview(data?.secure_url);
      setPublicId(data?.public_id);
      form.setValue("image", data?.secure_url);
    },
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteImageAction,
    onError: (error: TypeError) => toast.error(error.message),
    onSuccess: () => {
      setPublicId("");
      setImagePreview(undefined);
      form.setValue("image", "");
    },
  });

  const onDrop = useCallback(async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    mutate(formData);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    accept: {
      "image/jpeg": [".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/avif": [".avif"],
    },
    onDrop,
    maxFiles: 1,
  });

  return (
    <>
      <div className="space-y-2">
        <FormLabel>Imagen del Producto</FormLabel>
        <div
          {...getRootProps({
            className: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50 text-blue-900"
            : isDragReject
            ? "border-red-500 bg-red-50 text-red-900"
            : "border-border text-muted-foreground hover:border-primary hover:bg-muted/50"
        }
      `,
          })}
        >
          <input {...getInputProps()} />

          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg mx-auto"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (publicId) {
                    mutateDelete(publicId);
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {isDragAccept && (
                <>
                  <Upload className="h-12 w-12 text-blue-500" />
                  <p className="text-blue-700 font-medium">
                    Suelta la imagen aquí
                  </p>
                </>
              )}

              {isDragReject && (
                <>
                  <X className="h-12 w-12 text-red-500" />
                  <p className="text-red-700 font-medium">Archivo no válido.</p>
                </>
              )}

              {!isDragActive && (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Arrastra y suelta una imagen aquí
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mostrar estado de carga */}
        {isPending && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Subiendo imagen...
          </div>
        )}
        {isPendingDelete && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Eliminando imagen...
          </div>
        )}
      </div>
    </>
  );
}
