import React, { useState, useEffect } from "react";
import { fetchSystemLogs } from "../integrations/supabase/items";

const AdminSystemLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchSystemLogs();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching system logs:", error);
    }
  };

  return (
    <div>
      <h1>Admin: System Logs</h1>
      <div>
        {logs.map((log) => (
          <div key={log.id}>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(log.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Action:</strong> {log.action}
            </p>
            <p>
              <strong>Details:</strong> {log.details}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSystemLogs;
