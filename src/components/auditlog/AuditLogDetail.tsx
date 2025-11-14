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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <XCircle className="w-8 h-8" />
            <h3 className="text-xl font-semibold">Error</h3>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!log) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Audit Log Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6">
          {/* ID */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log ID
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-3 py-2 rounded border border-gray-200 text-sm font-mono">
                {log.id}
              </code>
              <button
                onClick={() => copyToClipboard(log.id, "id")}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                {copiedField === "id" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Date & Time
              </label>
              <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
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
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Activity className="w-4 h-4" />
                Status
              </label>
              <div>{getStatusBadge(log.status)}</div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-900">
              <User className="w-4 h-4" />
              User Information
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-blue-700 mb-1">User Name</div>
                <div className="bg-white px-3 py-2 rounded border border-blue-200 text-sm">
                  {log.userName || "Anonymous"}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700 mb-1">User ID</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-200 text-sm font-mono truncate">
                    {log.userId || "N/A"}
                  </code>
                  {log.userId && (
                    <button
                      onClick={() => copyToClipboard(log.userId!, "userId")}
                      className="px-2 py-1 border border-blue-300 rounded hover:bg-blue-100 transition-colors text-xs"
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
              <label className="block text-sm font-medium text-gray-700">Action</label>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 rounded-lg border border-blue-200">
                <span className="font-mono text-blue-900 font-semibold">
                  {log.action}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Endpoint</label>
              <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                <code className="text-sm font-mono text-gray-900">{log.endpoint}</code>
              </div>
            </div>
          </div>

          {/* Old Value */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Old Value (Before)
              </label>
              {log.old && (
                <button
                  onClick={() => copyToClipboard(log.old!, "old")}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
              <label className="block text-sm font-medium text-gray-700">
                New Value (After)
              </label>
              {log.new && (
                <button
                  onClick={() => copyToClipboard(log.new!, "new")}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
