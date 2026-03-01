import React, { useState, useRef } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DashboardLayout from '../components/DashboardLayout';
import { useAppContext } from '../context/AppContext';
import BankSlipForm from '../components/BankSlipForm';
import BankSlipPreview from '../components/BankSlipPreview';
import EmailReceiptForm from '../components/EmailReceiptForm';
import EmailReceiptPreview from '../components/EmailReceiptPreview';

const NIGERIAN_BANKS = [
  'GTBank', 'Access Bank', 'First Bank', 'Zenith Bank', 'UBA',
  'Fidelity Bank', 'Stanbic IBTC', 'Union Bank', 'Polaris Bank',
  'Wema Bank', 'Sterling Bank',
];

function generateTransactionRef() {
  return 'TRX' + Math.random().toString(36).substring(2, 14).toUpperCase();
}
function generateSessionId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function GenerateReceiptPage() {
  const { addReceipt, config, profile } = useAppContext();
  const [activeTab, setActiveTab] = useState('bank');
  const [generating, setGenerating] = useState(false);

  const [bankFormData, setBankFormData] = useState({
    senderName: '',
    senderAccount: '',
    senderBank: NIGERIAN_BANKS[0],
    receiverName: '',
    receiverAccount: '',
    receiverBank: NIGERIAN_BANKS[0],
    amount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    transactionTime: new Date().toTimeString().substring(0, 5),
    transactionRef: generateTransactionRef(),
    narration: '',
    sessionId: generateSessionId(),
    status: 'Successful',
  });

  const [emailFormData, setEmailFormData] = useState({
    fromName: '',
    fromEmail: '',
    toName: '',
    toEmail: '',
    subject: '',
    body: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().substring(0, 5),
    provider: 'Gmail',
  });

  const previewRef = useRef(null);
  const brand = config?.brand_color || '#f8812d';
  const cost = activeTab === 'bank' ? (config?.bank_slip_cost || 10) : (config?.email_receipt_cost || 5);
  const hasEnoughPoints = (profile?.points || 0) >= cost;

  const handleBankFormChange = (field, value) => setBankFormData(prev => ({ ...prev, [field]: value }));
  const handleEmailFormChange = (field, value) => setEmailFormData(prev => ({ ...prev, [field]: value }));

  const handleGenerateReceipt = async () => {
    if (!hasEnoughPoints) {
      toast.error(`You need ${cost} points to generate this receipt. Current balance: ${profile?.points || 0} pts`);
      return;
    }

    if (activeTab === 'bank') {
      if (!bankFormData.senderName || !bankFormData.receiverName || !bankFormData.amount) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else {
      if (!emailFormData.fromEmail || !emailFormData.toEmail || !emailFormData.subject) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    setGenerating(true);
    try {
      const receiptData = activeTab === 'bank'
        ? { type: 'bank', ...bankFormData }
        : { type: 'email', ...emailFormData };

      const result = await addReceipt(receiptData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Receipt generated and saved!');
      await downloadReceipt('png');
    } catch (err) {
      toast.error('Failed to generate receipt');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReceipt = async (format) => {
    const element = previewRef.current;
    if (!element) { toast.error('Preview not found'); return; }

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      if (format === 'png') {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `slipcraft_receipt_${Date.now()}.png`;
        link.click();
        toast.success('Downloaded as PNG!');
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`slipcraft_receipt_${Date.now()}.pdf`);
        toast.success('Downloaded as PDF!');
      }
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Generate Receipt</h1>
          <p className="text-gray-600">Create professional receipts instantly</p>
        </div>

        {/* Points balance + fee notice */}
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${hasEnoughPoints ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
          <AlertCircle size={20} className={hasEnoughPoints ? 'text-blue-500 mt-0.5' : 'text-red-500 mt-0.5'} />
          <div>
            <p className={`text-sm font-medium ${hasEnoughPoints ? 'text-blue-900' : 'text-red-900'}`}>
              {hasEnoughPoints
                ? <>Generation fee: <strong>{cost} points</strong> will be deducted. Your balance: <strong>{profile?.points || 0} pts</strong></>
                : <>Insufficient points. You need <strong>{cost} pts</strong> but have <strong>{profile?.points || 0} pts</strong>. <a href="/referral" className="underline">Earn more via referrals.</a></>
              }
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[{ key: 'bank', label: 'Bank Transfer Slip' }, { key: 'email', label: 'Email Receipt' }].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-6 py-3 font-semibold border-b-2 transition-colors"
              style={activeTab === tab.key
                ? { color: brand, borderColor: brand }
                : { color: '#6b7280', borderColor: 'transparent' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            {activeTab === 'bank' ? (
              <BankSlipForm data={bankFormData} onChange={handleBankFormChange} banks={NIGERIAN_BANKS} />
            ) : (
              <EmailReceiptForm data={emailFormData} onChange={handleEmailFormChange} />
            )}

            <button
              onClick={handleGenerateReceipt}
              disabled={generating || !hasEnoughPoints}
              className="w-full mt-6 px-6 py-3 rounded-lg font-semibold text-white text-center transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: brand }}
            >
              {generating ? 'Generating...' : `Generate & Download (${cost} pts)`}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
            <div ref={previewRef} className="bg-gray-50 rounded-lg p-4">
              {activeTab === 'bank' ? (
                <BankSlipPreview data={bankFormData} />
              ) : (
                <EmailReceiptPreview data={emailFormData} />
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => downloadReceipt('png')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                <Download size={16} /> PNG
              </button>
              <button
                onClick={() => downloadReceipt('pdf')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                <Download size={16} /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
