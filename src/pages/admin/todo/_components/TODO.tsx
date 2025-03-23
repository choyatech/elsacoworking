import { useState } from "react";

export const TODO = ({ tasks }: { tasks: any }) => {
  return (
    <section className="p-4">
      <ul>
        <li className="mb-4">
          <button className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary transition-colors font-medium flex items-center justify-center gap-2">
            <i className="fas fa-plus"></i>
            Agregar nueva tarea
          </button>
        </li>
        {tasks.map((task: any) => (
          <TodoItem key={task._id} task={task} />
        ))}
      </ul>
    </section>
  );
};

const TodoItem = ({ task }: { task: any }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [tempContent, setTempContent] = useState(task.content);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const handleDescriptionInput = (e: any) => {
    setTempContent(e.target.value);

    if (tempContent === task.content) {
      setShowSaveButton(false);
    } else {
      setShowSaveButton(true);
    }
  };
  return (
    <li className="border rounded-lg shadow-sm mb-4 overflow-hidden bg-white  transition-shadow">
      <h3
        className={`p-4 text-xl font-semibold ${
          task.isCompleted
            ? "line-through text-neutral-400"
            : "text-neutral-800"
        }`}
      >
        {task.title}
      </h3>
      <div className="border-t">
        {showDetails && (
          <div>
            <input
              type="text"
              className="p-4 text-neutral-600 bg-neutral-50 w-full outline-none"
              value={tempContent}
              onChange={handleDescriptionInput}
            />
            {showSaveButton && (
              <button
                onClick={() => setShowSaveButton(false)}
                className="px-4 ms-auto py-2 text-sm text-white bg-blue-600 hover:bg-blue-800 font-medium"
              >
                Guardar
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showDetails ? "Ocultar" : "Mostrar"} Detalles
        </button>
      </div>
      <p className="px-4 py-2 text-sm text-neutral-400 border-t bg-neutral-50">
        {new Date(task.$createdAt).toLocaleDateString()}
      </p>
    </li>
  );
};
