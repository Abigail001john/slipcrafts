import React, { useState, useMemo, useRef } from 'react';
import { Search, Download, Eye, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';
import BankSlipPreview from '../components/BankSlipPreview';
import EmailReceiptPreview from '../components/EmailReceiptPreview';

export default function HistoryPage() {
  const { receipts, config } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const previewRef = useRef(null);
  const itemsPerPage = 10;
  const brand = config?.brand_color || '#f8812d';

  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      if (typeFilter !== 'all' && receipt.type !== typeFilter) return false;
      const receiptDate = new Date(receipt.created_at || receipt.createdAt);
      if (dateFrom && receiptDate < new Date(dateFrom)) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (receiptDate > end) return false;
      }
      const d = receipt.data || receipt;
      const q = searchTerm.toLowerCase();
      if (!q) return true;
      if (receipt.type === 'bank') {
        return d.senderName?.toLowerCase().includes(q) || d.receiverName?.toLowerCase().includes(q) || d.transactionRef?.toLowerCase().includes(q);
      } else {
        return d.fromName?.toLowerCase().includes(q) || d.toName?.toLowerCase().includes(q) || d.subject?.toLowerCase().includes(q);
      }
    });
  }, [receipts, searchTerm, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReceipts.slice(start, start + itemsPerPage);
  }, [filteredReceipts, currentPage]);

  const openModal = (receipt) => { setSelectedReceipt(receipt); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedReceipt(null); };

  const downloadReceipt = async (format) => {
    if (!previewRef.current) { toast.error('Preview not found'); return; }
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
      if (format === 'png') {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `receipt_${Date.now()}.png`;
        link.click();
        toast.success('Downloaded as PNG!');
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`receipt_${Date.now()}.pdf`);
        toast.success('Downloaded as PDF!');
      }
    } catch { toast.error('Failed to download'); }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Receipt History</h1>
          <p className="text-gray-600">View and manage all your generated receipts</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search by name or reference..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2">
                <option value="all">All Types</option>
                <option value="bank">Bank Slip</option>
                <option value="email">Email Receipt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginatedReceipts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filteredReceipts.length)} of {filteredReceipts.length} results
          </div>
        </div>

        {/* Table */}
        {paginatedReceipts.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date','Type','Sender/From','Receiver/To','Amount/Subject','Reference','Status','Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedReceipts.map((receipt) => {
                    const d = receipt.data || receipt;
                    return (
                      <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {new Date(receipt.created_at || receipt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${brand}20`, color: brand }}>
                            {receipt.type === 'bank' ? 'Bank Slip' : 'Email Receipt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{receipt.type === 'bank' ? d.senderName : d.fromName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{receipt.type === 'bank' ? d.receiverName : d.toName}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {receipt.type === 'bank' ? `₦${Number(d.amount || 0).toLocaleString()}` : d.subject}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                          {receipt.type === 'bank' ? d.transactionRef : receipt.id?.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {receipt.type === 'bank' ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: d.status === 'Successful' ? '#10b98120' : '#ef444420', color: d.status === 'Successful' ? '#10b981' : '#ef4444' }}>
                              {d.status}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>Sent</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openModal(receipt)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View"><Eye size={18} className="text-gray-600" /></button>
                            <button onClick={() => { setSelectedReceipt(receipt); setTimeout(() => downloadReceipt('png'), 100); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download PNG"><Download size={18} className="text-gray-600" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium">Previous</button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium">Next</button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No receipts found</h3>
            <p className="text-gray-600">No receipts match your filters.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">Receipt Preview</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6">
              <div ref={previewRef}>
                {selectedReceipt.type === 'bank' ? (
                  <BankSlipPreview data={selectedReceipt.data || selectedReceipt} />
                ) : (
                  <EmailReceiptPreview data={selectedReceipt.data || selectedReceipt} />
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 p-6 flex gap-3">
              <button onClick={() => downloadReceipt('png')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50"><Download size={18} /> PNG</button>
              <button onClick={() => downloadReceipt('pdf')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50"><Download size={18} /> PDF</button>
              <button onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: brand }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
