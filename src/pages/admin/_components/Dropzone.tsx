import { MantineProvider } from "@mantine/core";
import { Dropzone, MIME_TYPES, type FileWithPath } from "@mantine/dropzone";
import { useState, useEffect, useRef } from "react";

export function DropzoneComponent({ multiple = true }: { multiple?: boolean }) {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  }, [files]);

  const previews = files.map((file, index) => {
    const fileUrl = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      return (
        <div key={index} className="relative aspect-square w-full">
          <img
            src={fileUrl}
            className="w-full h-full object-cover rounded-lg"
            onLoad={() => URL.revokeObjectURL(fileUrl)}
          />
          <span className="absolute bottom-0 left-0 right-0 text-xs bg-black/50 text-white truncate px-1 rounded-b-lg">
            {file.name}
          </span>
        </div>
      );
    }

    let icon = "fas fa-file";
    if (file.type === "application/pdf") icon = "fas fa-file-pdf";
    else if (file.type.includes("word")) icon = "fas fa-file-word";
    else if (file.type.includes("sheet") || file.type.includes("excel"))
      icon = "fas fa-file-excel";
    else if (
      file.type.includes("presentation") ||
      file.type.includes("powerpoint")
    )
      icon = "fas fa-file-powerpoint";

    return (
      <div
        key={index}
        className="relative aspect-square w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center"
      >
        <i className={`${icon} text-3xl text-gray-600`}></i>
        <span className="text-xs text-gray-600 mt-2 px-2 text-center truncate w-full">
          {file.name}
        </span>
      </div>
    );
  });

  return (
    <MantineProvider>
      <Dropzone
        onDrop={setFiles}
        accept={[
          MIME_TYPES.png,
          MIME_TYPES.jpeg,
          MIME_TYPES.svg,
          MIME_TYPES.gif,
          MIME_TYPES.pdf,
          MIME_TYPES.doc,
          MIME_TYPES.docx,
          MIME_TYPES.xls,
          MIME_TYPES.xlsx,
          MIME_TYPES.ppt,
          MIME_TYPES.pptx,
          MIME_TYPES.heic,
          MIME_TYPES.heif,
        ]}
        multiple={multiple}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors"
      >
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-700 mb-2">
            Suelta los archivos aquí
          </h1>
          <p className="text-sm text-gray-500">
            O haz clic para seleccionar archivos
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 mt-4">
          {previews}
        </div>
      </Dropzone>

      {/* Input oculto para enviar los archivos */}
      <input type="file" name="files" multiple hidden ref={fileInputRef} />
    </MantineProvider>
  );
}
