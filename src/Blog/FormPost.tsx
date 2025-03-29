import { useState, type SyntheticEvent } from "react";
import { ID } from "appwrite";
import { databases } from "../lib/appwrite";
import { CustomEditor } from "@/src/blog/Editor";

export const FormPost = () => {
  const [content, setContent] = useState<string>("");
  const [slugValue, setSlugValue] = useState<string>();

  const handleUpdateTitle = (event: SyntheticEvent) => {
    const target = event.target as typeof event.target & { value: string };
    const newSlug = target.value.toLowerCase();
    setSlugValue(newSlug.replaceAll(" ", "-"));
  };

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      title: { value: string };
      slug: { value: string };
      description: { value: string };
    };

    const results = await databases.createDocument(
      import.meta.env.PUBLIC_APPWRITE_DB,
      import.meta.env.PUBLIC_APPWRITE_POSTS,
      ID.unique(),
      {
        title: target.title.value,
        slug: target.slug.value,
        description: target.description.value,
        content,
      }
    );

    if (results)
      window.location.href = `${import.meta.env.PUBLIC_APP_ROUTE}/blog/${
        target.slug.value
      }`;
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium ">
          Título
        </label>
        <input
          placeholder="Escribe aquí..."
          type="text"
          id="title"
          name="title"
          onChange={handleUpdateTitle}
          required
          className="mt-1 p-4 pe-9 block w-full border-gray-200 rounded-lg text-sm  disabled:opacity-50 disabled:pointer-events-none  border border-gray focus:outline-none"
        />
        <span className="text-sm text-neutral-400">Slug: {slugValue}</span>
      </div>
      <div className="hidden">
        <input
          type="text"
          id="slug"
          name="slug"
          required
          value={slugValue}
          className="mt-1 p-4 pe-9 block w-full border-gray-200 rounded-lg text-sm  disabled:opacity-50 disabled:pointer-events-none  border border-gray focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium ">
          Descripción
        </label>
        <input
          placeholder="Escribe aquí..."
          type="text"
          id="description"
          name="description"
          required
          className="mt-1 p-4 pe-9 block w-full border-gray-200 rounded-lg text-sm  disabled:opacity-50 disabled:pointer-events-none  border border-gray focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium ">
          Contenido
        </label>
        <CustomEditor setContent={setContent} content={content} />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <i className="fas fa-plus mr-2" />
          Crear
        </button>
      </div>
    </form>
  );
};
