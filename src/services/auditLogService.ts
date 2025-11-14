import axiosClient from "../utils/axiosClient";
import {
  AuditLogDto,
  AuditLogSearchParams,
  ApiResponse,
  PagedResponse,
} from "../types/auditLog";

const auditLogService = {
  /**
   * Get paginated list of audit logs with filters
   */
  getList: async (
    params: AuditLogSearchParams
  ): Promise<ApiResponse<PagedResponse<AuditLogDto>>> => {
    const response = await axiosClient.get<ApiResponse<PagedResponse<AuditLogDto>>>("/auditlog", { params });
    return response.data;
  },

  /**
   * Get single audit log by ID
   */
  getById: async (id: string): Promise<ApiResponse<AuditLogDto>> => {
    const response = await axiosClient.get<ApiResponse<AuditLogDto>>(`/auditlog/${id}`);
    return response.data;
  },

  /**
   * Export audit logs to CSV
   */
  exportCsv: async (params: AuditLogSearchParams): Promise<void> => {
    const response = await axiosClient.get<Blob>("/auditlog/export", {
      params,
      responseType: "blob",
    });

    // Auto download file
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `AuditLogs_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Test create log (for development)
   */
  testCreateLog: async (data: {
    action: string;
    endpoint: string;
    old?: Record<string, unknown>;
    new?: Record<string, unknown>;
  }): Promise<ApiResponse<string>> => {
    const response = await axiosClient.post<ApiResponse<string>>("/auditlog/test-log", data);
    return response.data;
  },
};

export default auditLogService;
