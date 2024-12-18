"use client"

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Proof, ReclaimProofRequest,transformForOnchain } from '@reclaimprotocol/js-sdk';
import { createPublicClient, defineChain, http, PublicClient, } from 'viem'
import artifacts from "../abi/Attestor.json";
import addresses from "../shared/data/addresses.json";

export const custom = /*#__PURE__*/ defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
  name: process.env.NEXT_PUBLIC_CHAIN_NAME!,
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_CHAIN_URL!] },
  },
})
 
function ReclaimDemo() {
  // State to store the verification request URL
  const [requestUrl, setRequestUrl] = useState('');
  const [proof, setProof] = useState<Proof>();
  const [hasProof, setHasProof] = useState(false);
  const [publicClient, setPublicClient] = useState<PublicClient>();

 
  const getVerificationReq = async () => {
    // Your credentials from the Reclaim Developer Portal
    // Replace these with your actual credentials
    const APP_ID = process.env.NEXT_PUBLIC_APP_ID!;
    const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET!;
    const PROVIDER_ID = process.env.NEXT_PUBLIC_PROVIDER_ID!;
 
    // Initialize the Reclaim SDK with your credentials
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
 
    // Generate the verification request URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    console.log('Request URL:', requestUrl);
    setRequestUrl(requestUrl);
 
    // Start listening for proof submissions
    await reclaimProofRequest.startSession({
      // Called when the user successfully completes the verification
      onSuccess: (proof) => {
        if (proof) {
          if (typeof proof === 'string') {
            // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
            console.log('SDK Message:', proof);
            setProof(proof);
            setHasProof(true);
          } else if (typeof proof !== 'string') {
            // When using the default callback url, we get a proof object in the response
            console.log('Proof generation success', proof?.claimData.context);
            setProof(proof);
            setHasProof(true);
          }
        }
        // Add your success logic here, such as:
        // - Updating UI to show verification success
        // - Storing verification status
        // - Redirecting to another page
      },
      // Called if there's an error during verification
      onError: (error) => {
        console.error('Verification failed', error);
 
        // Add your error handling logic here, such as:
        // - Showing error message to user
        // - Resetting verification state
        // - Offering retry options
      },
    });
  };

  const getSolidityProof = async () => {

    console.log(transformForOnchain(proof!))

    const data = await publicClient!.readContract({
      address: addresses["Attestor"] as `0x${string}`,
      abi: artifacts.abi,
      functionName: 'verifyProof',
      args: [transformForOnchain(proof!)]
    }); 

    console.log(data)

    alert("On-chain verification successful");

  };

  useEffect(()=>{
    const publicClient = createPublicClient({ 
      chain: custom,
      transport: http(process.env.NEXT_PUBLIC_CHAIN_URL)
    })
    setPublicClient(publicClient);
  },[])
 
  return (
    <>
      {/* Display QR code when URL is available */}
      {requestUrl && (
        <div style={{ margin: '20px 0' }}>
          <QRCode value={requestUrl} />
        </div>
      )}
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={getVerificationReq}>Get Verification Request</button>
      {proof && hasProof && (
        <div className='flex flex-col space-y-4 mt-6'>
          <h2 className='text-center font-bold'>Proof Generation Successful!</h2>
          <div className='w-full overflow-x-auto'>{JSON.stringify(proof, null, 2)}</div>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-center' onClick={getSolidityProof}>Verify Proof On-Chain</button>
        </div>
      )}
    </>
  );
}
 
export default ReclaimDemo;