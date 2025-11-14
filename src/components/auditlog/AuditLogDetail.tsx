import { useState, useEffect } from "react";
import { AuditLogDto } from "../../types/auditLog";
import auditLogService from "../../services/auditLogService";
import { X, Copy, CheckCircle, XCircle, Calendar, User, Activity } from "lucide-react";

interface AuditLogDetailProps {
  logId: string;
  onClose: () => void;
}

export default function AuditLogDetail({ logId, onClose }: AuditLogDetailProps) {
  const [log, setLog] = useState<AuditLogDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await auditLogService.getById(logId);
        setLog(response.data);
      } catch (err) {
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch log details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [logId]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatJson = (jsonString: string | null) => {
    if (!jsonString) return "N/A";
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "SUCCESS") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          SUCCESS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle className="w-4 h-4 mr-1" />
        FAILED
      </span>
    );
  };

  if (!log && !loading && !error) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop với blur */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="p-8">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <XCircle className="w-8 h-8" />
                <h3 className="text-xl font-semibold">Error</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {log && !loading && !error && (
            <>
              {/* Header với gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Audit Log Details</h2>
                    <p className="text-blue-100 text-sm mt-1">View detailed log information</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2.5 text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* ID */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Log ID
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-200 dark:border-gray-600 text-sm font-mono">
                      {log.id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(log.id, "id")}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      {copiedField === "id" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      Date & Time
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Activity className="w-4 h-4" />
                      Status
                    </label>
                    <div>{getStatusBadge(log.status)}</div>
                  </div>
                </div>

                {/* User Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-300">
                    <User className="w-4 h-4" />
                    User Information
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-blue-700 dark:text-blue-400 mb-1">User Name</div>
                      <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded border border-blue-200 dark:border-blue-700 text-sm">
                        {log.userName || "Anonymous"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-700 dark:text-blue-400 mb-1">User ID</div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white dark:bg-gray-800 px-3 py-2 rounded border border-blue-200 dark:border-blue-700 text-sm font-mono truncate">
                          {log.userId || "N/A"}
                        </code>
                        {log.userId && (
                          <button
                            onClick={() => copyToClipboard(log.userId!, "userId")}
                            className="px-2 py-1 border border-blue-300 dark:border-blue-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-xs"
                          >
                            {copiedField === "userId" ? "✓" : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action & Endpoint */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <span className="font-mono text-blue-900 dark:text-blue-300 font-semibold">
                        {log.action}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint</label>
                    <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                      <code className="text-sm font-mono text-gray-900 dark:text-gray-100">{log.endpoint}</code>
                    </div>
                  </div>
                </div>

                {/* Old Value */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Old Value (Before)
                    </label>
                    {log.old && (
                      <button
                        onClick={() => copyToClipboard(log.old!, "old")}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedField === "old" ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-gray-700">
                    {formatJson(log.old)}
                  </pre>
                </div>

                {/* New Value */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Value (After)
                    </label>
                    {log.new && (
                      <button
                        onClick={() => copyToClipboard(log.new!, "new")}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedField === "new" ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-gray-700">
                    {formatJson(log.new)}
                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
