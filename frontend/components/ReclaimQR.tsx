import QRCode from "react-qr-code";

type ReclaimQRProps = {
    requestUrl: string;
}

export default function ProofSection(props: ReclaimQRProps) {
    return (
      <div className="flex flex-col items-center">
        {
          props.requestUrl ? 
            <>
              <a 
                href={props.requestUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mb-4 px-4 py-2 border-2 border-gray-400 text-gray-600 hover:border-gray-600 
                         hover:text-gray-800 rounded-lg transition-colors duration-200 text-sm flex items-center justify-between w-auto"
              >
                <span>Se sei da mobile, apri il link</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
              <div className="border-2 border-gray-200 rounded-lg p-3">
                <QRCode value={props.requestUrl} size={200}/>
              </div>
            </>
            :
            <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-100 rounded-lg border-2 border-gray-200">
              <h2 className="text-gray-500">QR non ancora generato</h2>
            </div>
        }
      </div>
    );
}