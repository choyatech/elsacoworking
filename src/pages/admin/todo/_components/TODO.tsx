import { useState } from "react";
import { databases } from "@/src/lib/appwrite";
import { ID } from "node-appwrite";
import { motion, AnimatePresence } from "motion/react";

export const TODO = ({ tasks }: { tasks: any }) => {
  return (
    <AnimatePresence>
      <ul className="mt-4">
        <CreateTodoForm />
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

  const deleteTask = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      await databases.deleteDocument(
        import.meta.env.PUBLIC_APPWRITE_DB,
        import.meta.env.PUBLIC_APPWRITE_TASKS,
        task["$id"]
      );
      window.location.reload();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.li
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="border border-[#d0d7de] rounded-md flex flex-col justify-between bg-white mb-3"
      >
        <div className="p-3">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <motion.input
                whileTap={{ scale: 0.9 }}
                type="checkbox"
                checked={isChecked}
                onChange={() => onCheck()}
                className="w-4 h-4 rounded border-gray-300"
              />
              <motion.h3
                animate={{ opacity: isChecked ? 0.6 : 1 }}
                transition={{ duration: 0.2 }}
                className={`text-sm font-medium ${
                  isChecked ? "line-through text-[#6e7781]" : "text-[#24292f]"
                }`}
              >
                {task.title}
              </motion.h3>
            </div>
          </div>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 overflow-hidden"
              >
                <textarea
                  className="w-full p-2 border border-[#d0d7de] rounded-md focus:outline-none focus:ring-1 min-h-[100px] text-sm"
                  value={tempContent}
                  onChange={handleDescriptionInput}
                  placeholder="Task description..."
                />
                <AnimatePresence>
                  {showSaveButton && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-end mt-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateTask()}
                        className="px-3 py-1 text-sm bg-[#2da44e] text-white rounded-md hover:bg-[#2c974b] transition-colors"
                      >
                        Save Changes
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-[#f6f8fa] border-t border-[#d0d7de] rounded-b-md">
          <span className="text-xs text-[#57606a]">
            Created: {new Date(task.$createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-4">
            <motion.button
              onClick={deleteTask}
              className="text-xs text-[#da1709] hover:text-[#da1709]/80 font-medium"
            >
              Eliminar Tarea
            </motion.button>
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-[#0969da] hover:text-[#0969da]/80 font-medium"
            >
              {showDetails ? "Ocultar" : "Mostrar"} Detalles
            </motion.button>
          </div>
        </div>
      </motion.li>
    </AnimatePresence>
  );
};
const CreateTodoForm = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await databases.createDocument(
      import.meta.env.PUBLIC_APPWRITE_DB,
      import.meta.env.PUBLIC_APPWRITE_TASKS,
      ID.unique(),
      {
        title,
        content,
        isCompleted: false,
      }
    );

    setTitle("");
    setContent("");
    setShowCreateForm(false);
    window.location.reload();
  };

  return (
    <motion.li
      className="mb-4"
      layout
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      <AnimatePresence mode="wait">
        {showCreateForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="mb-4"
          >
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titulo..."
              className="w-full p-2 mb-2 border outline-none border-[#d0d7de] rounded-md"
            />
            <motion.textarea
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Descripción..."
              className="w-full p-2 mb-2 border outline-none border-[#d0d7de] rounded-md min-h-[100px]"
            />
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <motion.button
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
                type="submit"
                className="w-full py-2 px-4 rounded-md border bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
                type="submit"
                className="w-full py-2 px-4 bg-[#2da44e] text-white rounded-md hover:bg-[#2c974b] transition-colors"
                onClick={() => handleSubmit()}
              >
                Crear Tarea
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="add-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-full py-2 px-4 bg-[#2da44e] text-white rounded-md hover:bg-[#2c974b] transition-colors font-medium flex items-center justify-center gap-2 text-sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <i className="fas fa-plus"></i>
            Agregar nueva tarea
          </motion.button>
        )}
      </AnimatePresence>
    </motion.li>
  );
};
