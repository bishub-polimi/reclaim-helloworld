import React from 'react';
import { Check, AlertCircle, ExternalLink } from 'lucide-react';
import { NotificationData, extractMainHash } from "@/hooks/useNotifications";


type NotificationStackProps = {
  notifications: NotificationData[];
  onClose: (id: string) => void;
};

const NotificationBanner = ({ notifications, onClose }: NotificationStackProps) => {
  if (!notifications.length) return null;

  const handleTxClick = (txHash: string) => {
    const baseUrl = 'https://base-sepolia.blockscout.com';
    const path = txHash.length > 66 ? 'op' : 'tx';
    const hash = txHash.length > 66 ? extractMainHash(txHash) : txHash;
    window.open(`${baseUrl}/${path}/${hash}`, '_blank');
  };


  const formatMessage = (notification: NotificationData) => {
    if (!notification.txHash) return notification.message.slice(0, 120);

    const parts = notification.message.split(notification.txHash);
    return (
      <>
        {parts[0]}
        <button 
          onClick={() => handleTxClick(notification.txHash!)}
          className="inline-flex items-center gap-1 underline hover:text-blue-600"
        >
          {`${notification.txHash.slice(0, 6)}...${notification.txHash.slice(-4)}`}
          <ExternalLink className="h-3 w-3" />
        </button>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`transition-all duration-300 ${
            notification.isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
          }`}
        >
          <div
            className={`
              rounded-lg border p-4 shadow-lg
              ${notification.type === 'success' 
                ? 'bg-[rgba(160,246,160,0.95)] border-green text-green' 
                : 'bg-[rgba(243,173,173,0.95)] border-red text-red'}
              }
            `}
            role="alert"
          >
            <div className="flex items-start gap-2">
              {notification.type === 'success' ? (
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-base font-bold break-all">
                {formatMessage(notification)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;