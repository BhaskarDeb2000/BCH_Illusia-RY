import React, { useState, useEffect } from "react";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/itemService";
import { Item } from "../models/Item";

const AdminItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Partial<Item>>({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const fetchedItems = await getItems();
    setItems(fetchedItems);
  };

  const handleCreate = async () => {
    if (!newItem.name || !newItem.category) {
      alert("Name and category are required");
      return;
    }
    const createdItem = await createItem(newItem as Item);
    setItems([...items, createdItem]);
    setNewItem({});
  };

  const handleUpdate = async (id: string, updatedFields: Partial<Item>) => {
    const updatedItem = await updateItem(id, updatedFields);
    setItems(items.map((item) => (item.id === id ? updatedItem : item)));
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1>Admin: Manage Items</h1>

      <div>
        <h2>Create New Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name || ""}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category || ""}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <div>
        <h2>Existing Items</h2>
        {items.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>Category: {item.category}</p>
            <button
              onClick={() => handleUpdate(item.id, { name: "Updated Name" })}
            >
              Update
            </button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminItems;
