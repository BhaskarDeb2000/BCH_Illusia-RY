import React, { useState, useEffect } from "react";
import {
  fetchUsers,
  approveUser,
  deactivateUser,
} from "../integrations/supabase/users";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveUser(id);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: "approved" } : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateUser(id);
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: "deactivated" } : user
        )
      );
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  return (
    <div>
      <h1>Admin: User Management</h1>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <p>Status: {user.status}</p>
            <button onClick={() => handleApprove(user.id)}>Approve</button>
            <button onClick={() => handleDeactivate(user.id)}>
              Deactivate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
