import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Share with Friends</h3>
          <p className="text-gray-400 text-sm">Scan this QR code to open the app on another device.</p>
        </div>

        <div className="flex justify-center mb-6 bg-white p-4 rounded-xl">
          <QRCodeSVG
            value={url}
            size={200}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
          <p className="text-neon-blue text-xs font-mono break-all line-clamp-2">{url}</p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
