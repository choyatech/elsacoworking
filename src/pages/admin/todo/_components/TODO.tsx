import { useState } from "react";
import { databases } from "@/src/lib/appwrite";
import { motion, AnimatePresence } from "motion/react";

export const TODO = ({ tasks }: { tasks: any }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  return (
    <AnimatePresence>
      <ul className="mt-4">
        <motion.li className="mb-4">
          {showCreateForm ? (
            <CreateTodoForm setShowCreateForm={setShowCreateForm} />
          ) : (
            <button
              className="w-full py-2 px-4 bg-[#2da44e] text-white rounded-md hover:bg-[#2c974b] transition-colors font-medium flex items-center justify-center gap-2 text-sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <i className="fas fa-plus"></i>
              Agregar nueva tarea
            </button>
          )}
        </motion.li>
        {tasks.map((task: any) => (
          <TodoItem key={task["$id"]} task={task} />
        ))}
      </ul>
    </AnimatePresence>
  );
};

const TodoItem = ({ task }: { task: any }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [tempContent, setTempContent] = useState(task.content);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isChecked, setIsChecked] = useState(task.isCompleted);

  const handleDescriptionInput = (e: any) => {
    setTempContent(e.target.value);
    setShowSaveButton(e.target.value !== task.content);
  };

  const onCheck = async () => {
    setIsChecked(!isChecked);
    await databases.updateDocument(
      import.meta.env.PUBLIC_APPWRITE_DB,
      import.meta.env.PUBLIC_APPWRITE_TASKS,
      task["$id"],
      {
        isCompleted: !isChecked,
      }
    );
  };

  const updateTask = async () => {
    await databases.updateDocument(
      import.meta.env.PUBLIC_APPWRITE_DB,
      import.meta.env.PUBLIC_APPWRITE_TASKS,
      task["$id"],
      {
        content: tempContent,
      }
    );
    setShowSaveButton(false);
  };

  return (
    <div className="border border-[#d0d7de] rounded-md bg-white mb-3">
      <div className="p-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onCheck()}
            className="w-4 h-4 rounded border-gray-300"
          />
          <h3
            className={`text-sm font-medium ${
              isChecked ? "line-through text-[#6e7781]" : "text-[#24292f]"
            }`}
          >
            {task.title}
          </h3>
        </div>
        {showDetails && (
          <div className="mt-3">
            <textarea
              className="w-full p-2 border border-[#d0d7de] rounded-md focus:outline-none  focus:ring-1  min-h-[100px] text-sm"
              value={tempContent}
              onChange={handleDescriptionInput}
              placeholder="Task description..."
            />
            {showSaveButton && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => updateTask()}
                  className="px-3 py-1 text-sm bg-[#2da44e] text-white rounded-md hover:bg-[#2c974b] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-[#f6f8fa] border-t border-[#d0d7de] rounded-b-md">
        <span className="text-xs text-[#57606a]">
          Created: {new Date(task.$createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-[#0969da] hover:text-[#0969da]/80 font-medium"
        >
          {showDetails ? "Hide" : "Show"} Details
        </button>
      </div>
    </div>
  );
};
const CreateTodoForm = ({ setShowCreateForm }: any) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await databases.createDocument(
      import.meta.env.PUBLIC_APPWRITE_DB,
      import.meta.env.PUBLIC_APPWRITE_TASKS,
      crypto.randomUUID(),
      {
        title,
        content,
        isCompleted: false,
      }
    );

    setTitle("");
    setContent("");
    setShowCreateForm(false);
  };

  return (
    <motion.div layout onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titulo..."
        className="w-full p-2 mb-2 border outline-none border-[#d0d7de] rounded-md"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Descripción..."
        className="w-full p-2 mb-2 border outline-none border-[#d0d7de] rounded-md min-h-[100px]"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="w-full py-2 px-4  rounded-md border bg-slate-50 hover:bg-slate-100 transition-colors"
          onClick={() => setShowCreateForm(false)}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#2da44e] text-white rounded-md hover:bg-[#2c974b] transition-colors"
        >
          Crear Tarea
        </button>
      </div>
    </motion.div>
  );
};
