import { Editor } from "primereact/editor";
import { useState } from "react";

export const CustomEditor = () => {
  const [text, setText] = useState("");
  return (
    <Editor
      value={text}
      onTextChange={e => setText(e.htmlValue as string)}
      style={{ height: "320px" }}
    />
  );
};
