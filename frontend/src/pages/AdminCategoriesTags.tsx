import React, { useState, useEffect } from "react";
import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
} from "../integrations/supabase/items";

const AdminCategoriesTags = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleCreateCategory = async () => {
    try {
      await createCategory(newCategory);
      setCategories([...categories, newCategory]);
      setNewCategory("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCreateTag = async () => {
    try {
      await createTag(newTag);
      setTags([...tags, newTag]);
      setNewTag("");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    try {
      await deleteCategory(category);
      setCategories(categories.filter((c) => c !== category));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteTag = async (tag: string) => {
    try {
      await deleteTag(tag);
      setTags(tags.filter((t) => t !== tag));
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div>
      <h1>Admin: Category & Tag Management</h1>

      <div>
        <h2>Categories</h2>
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Add Category</button>
        <ul>
          {categories.map((category) => (
            <li key={category}>
              {category}{" "}
              <button onClick={() => handleDeleteCategory(category)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Tags</h2>
        <input
          type="text"
          placeholder="New Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button onClick={handleCreateTag}>Add Tag</button>
        <ul>
          {tags.map((tag) => (
            <li key={tag}>
              {tag} <button onClick={() => handleDeleteTag(tag)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCategoriesTags;
