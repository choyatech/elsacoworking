import { databases } from "@/src/lib/appwrite";
import { useState, useEffect } from "react";

interface Props {
  value: string;
  elementName: string;
  id: string;
  onSave?: (newValue: string) => void;
  className?: string;
  db?: string;
  isContactField?: boolean;
}

export const EditableTextField = ({
  value,
  elementName,
  id,
  className = "",
  db = import.meta.env.PUBLIC_APPWRITE_CLIENTS,
  isContactField = false,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  // Actualizar newValue cuando value cambie
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  const handleSave = async () => {
    const res = await databases.updateDocument(
      import.meta.env.PUBLIC_APPWRITE_DB,
      db,
      id,
      {
        [elementName]: newValue,
      }
    );
    setIsEditing(false);

    if (res) {
      window.location.reload();
    }
  };

  return (
    <div className={`inline-flex ${className}`}>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="bg-white border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:border-gray-400 transition"
            maxLength={24}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-700"
          >
            <i className="fa fa-save" />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-red-600 hover:text-red-700"
          >
            <i className="fa fa-ban" />
          </button>
        </div>
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className="cursor-pointer hover:bg-gray-100 p-1 rounded"
        >
          {isContactField ? (
            <a
              href={value.includes("@") ? `mailto:${value}` : `tel:${value}`}
              className="text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            value
          )}
        </p>
      )}
    </div>
  );
};
