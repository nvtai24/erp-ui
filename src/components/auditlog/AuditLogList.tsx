import { useState, useEffect } from "react";
import { AuditLogDto, AuditLogSearchParams } from "../../types/auditLog";
import auditLogService from "../../services/auditLogService";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AuditLogListProps {
  onViewDetail?: (log: AuditLogDto) => void;
}

export default function AuditLogList({ onViewDetail }: AuditLogListProps) {
  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
  });

  const [filters, setFilters] = useState<AuditLogSearchParams>({
    pageIndex: 1,
    pageSize: 10,
    logStatus: "",
    userId: "",
    action: "",
    endpoint: "",
    keyword: "",
    fromDate: "",
    toDate: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Remove empty filters
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)
      );

      const response = await auditLogService.getList(cleanFilters);
      
      // Check if response.data is array (backend might return array directly)
      let items: AuditLogDto[] = [];
      let paginationData = {
        pageIndex: filters.pageIndex || 1,
        pageSize: filters.pageSize || 10,
        totalPages: 0,
        totalCount: 0,
      };

      if (Array.isArray(response.data)) {
        // Backend returns array directly - need client-side pagination
        // Sort by createdAt descending (newest first)
        const allItems = response.data.sort((a: AuditLogDto, b: AuditLogDto) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const currentPageSize = filters.pageSize || 10;
        const currentPageIndex = filters.pageIndex || 1;
        
        paginationData.totalCount = allItems.length;
        paginationData.totalPages = Math.ceil(allItems.length / currentPageSize);
        paginationData.pageIndex = currentPageIndex;
        paginationData.pageSize = currentPageSize;
        
        // Slice items for current page
        const startIndex = (currentPageIndex - 1) * currentPageSize;
        const endIndex = startIndex + currentPageSize;
        items = allItems.slice(startIndex, endIndex);
      } else if (response.data && typeof response.data === 'object') {
        // Backend returns object with items
        if (response.data.items && Array.isArray(response.data.items)) {
          items = response.data.items;
          paginationData = {
            pageIndex: response.data.pageIndex || filters.pageIndex || 1,
            pageSize: response.data.pageSize || filters.pageSize || 10,
            totalPages: response.data.totalPages || 0,
            totalCount: response.data.totalCount || 0,
          };
        }
      }
      
      setLogs(items);
      setPagination(paginationData);
    } catch (err) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch audit logs";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleExport = async () => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)
      );
      await auditLogService.exportCsv(cleanFilters);
    } catch {
      alert("Failed to export CSV");
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, pageIndex: newPage });
  };

  const handleFilterChange = (key: keyof AuditLogSearchParams, value: string | number) => {
    setFilters({ ...filters, [key]: value, pageIndex: 1 });
  };

  const handleReset = () => {
    setFilters({
      pageIndex: 1,
      pageSize: 10,
      logStatus: "",
      userId: "",
      action: "",
      endpoint: "",
      keyword: "",
      fromDate: "",
      toDate: "",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "SUCCESS") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          SUCCESS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        FAILED
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with Search and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by keyword..."
                value={filters.keyword || ""}
                onChange={(e) => handleFilterChange("keyword", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Filter by user ID"
                  value={filters.userId || ""}
                  onChange={(e) => handleFilterChange("userId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <input
                  type="text"
                  placeholder="e.g., CREATE_PRODUCT"
                  value={filters.action || ""}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endpoint
                </label>
                <input
                  type="text"
                  placeholder="e.g., /api/products"
                  value={filters.endpoint || ""}
                  onChange={(e) => handleFilterChange("endpoint", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.logStatus || ""}
                  onChange={(e) => handleFilterChange("logStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.fromDate || ""}
                  onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.toDate || ""}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2 flex gap-2 items-end">
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!logs || logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-12 h-12 text-gray-400" />
                        <p className="text-lg font-medium">No audit logs found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {log.userName || "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.userId ? log.userId.substring(0, 8) + "..." : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {log.endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => onViewDetail?.(log)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {logs && logs.length > 0 && pagination.totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button 
                  onClick={() => handlePageChange(pagination.pageIndex - 1)} 
                  disabled={pagination.pageIndex === 1} 
                  className="px-4 py-2 border rounded disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  Prev
                </button>
                <button 
                  onClick={() => handlePageChange(pagination.pageIndex + 1)} 
                  disabled={pagination.pageIndex === pagination.totalPages} 
                  className="px-4 py-2 border rounded disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(pagination.pageIndex - 1) * pagination.pageSize + 1}</span> to <span className="font-medium">{Math.min(pagination.pageIndex * pagination.pageSize, pagination.totalCount)}</span> of <span className="font-medium">{pagination.totalCount}</span> results
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button 
                    onClick={() => handlePageChange(pagination.pageIndex - 1)} 
                    disabled={pagination.pageIndex === 1} 
                    className="px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button 
                      key={page} 
                      onClick={() => handlePageChange(page)} 
                      className={`px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        pagination.pageIndex === page
                          ? "bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200"
                          : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => handlePageChange(pagination.pageIndex + 1)} 
                    disabled={pagination.pageIndex === pagination.totalPages} 
                    className="px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
