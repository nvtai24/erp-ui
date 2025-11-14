import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AuditLogList from "../../components/auditlog/AuditLogList";
import AuditLogDetail from "../../components/auditlog/AuditLogDetail";
import { AuditLogDto } from "../../types/auditLog";
import { FileText } from "lucide-react";

export default function AuditLog() {
  const [selectedLog, setSelectedLog] = useState<AuditLogDto | null>(null);

  const handleViewDetail = (log: AuditLogDto) => {
    setSelectedLog(log);
  };

  const handleCloseDetail = () => {
    setSelectedLog(null);
  };

  return (
    <>
      <PageMeta 
        title="Audit Log" 
        description="Track and monitor all system activities and changes"
      />
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
          </div>
          <p className="text-gray-600">
            Track and monitor all system activities and changes
          </p>
        </div>

        {/* Audit Log List */}
        <AuditLogList onViewDetail={handleViewDetail} />

        {/* Detail Modal */}
        {selectedLog && (
          <AuditLogDetail logId={selectedLog.id} onClose={handleCloseDetail} />
        )}
      </div>
    </>
  );
}
