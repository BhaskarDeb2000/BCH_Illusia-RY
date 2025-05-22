import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];

export async function logAuditEvent(log: Omit<AuditLogInsert, "id" | "timestamp">) {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .insert([
        {
          action: log.action,
          entity_type: log.entity_type,
          entity_id: log.entity_id,
          user_id: log.user_id,
          details: log.details || {},
          timestamp: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Failed to log audit event:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error logging audit event:", error);
    return null;
  }
}

export async function getAuditLogs(
  filters: {
    action?: string;
    entityType?: string;
    entityId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {},
  page = 1,
  pageSize = 20
) {
  try {
    let query = supabase.from("audit_logs").select("*", { count: "exact" });

    if (filters.action) {
      query = query.eq("action", filters.action);
    }

    if (filters.entityType) {
      query = query.eq("entity_type", filters.entityType);
    }

    if (filters.entityId) {
      query = query.eq("entity_id", filters.entityId);
    }

    if (filters.userId) {
      query = query.eq("user_id", filters.userId);
    }

    if (filters.startDate) {
      query = query.gte("timestamp", filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte("timestamp", filters.endDate);
    }

    const { data, error, count } = await query
      .order("timestamp", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error("Failed to fetch audit logs:", error);
      return { logs: [], total: 0 };
    }

    return {
      logs: data as AuditLog[],
      total: count || 0,
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return { logs: [], total: 0 };
  }
}

// Common audit actions
export const AuditActions = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  VIEW: "view",
  LOGIN: "login",
  LOGOUT: "logout",
  EXPORT: "export",
  IMPORT: "import",
} as const;

// Common entity types
export const EntityTypes = {
  ITEM: "item",
  USER: "user",
  CART: "cart",
  ORDER: "order",
  CATEGORY: "category",
  TAG: "tag",
} as const; 