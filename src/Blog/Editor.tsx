import { Editor } from "primereact/editor";
import { useState } from "react";

export const CustomEditor = ({ setContent, content }: any) => {
  return (
    <Editor
      value={content}
      onTextChange={e => setContent(e.htmlValue as string)}
      style={{ height: "320px" }}
    />
  );
};
