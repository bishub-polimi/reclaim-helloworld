"use client"

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { ReclaimProofRequest,transformForOnchain } from '@reclaimprotocol/js-sdk';
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import artifacts from "../abi/Attestor.json";
 
function ReclaimDemo() {
  // State to store the verification request URL
  const [requestUrl, setRequestUrl] = useState('');
  const [proofs, setProofs] = useState([]);
  const [hasProof, setHasProof] = useState(false);
  const [provider, setProvider] = useState<JsonRpcProvider>();
  const [contract, setContract] = useState<Contract>();
  
 
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
      onSuccess: (proofs) => {
        if (proofs) {
          if (typeof proofs === 'string') {
            // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
            console.log('SDK Message:', proofs);
            setProofs([proofs]);
            setHasProof(true);
          } else if (typeof proofs !== 'string') {
            // When using the default callback url, we get a proof object in the response
            console.log('Verification success', proofs?.claimData.context);
            setProofs(proofs);
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
    console.log(JSON.stringify(transformForOnchain(proofs)))
    const res = await contract!.verifyProof(transformForOnchain(proofs));
    alert(res);
  };

  useEffect(()=>{
    setProvider(new JsonRpcProvider());
  },[])

  useEffect(()=>{
    if(provider){
      const wallet = Wallet.createRandom();
      const signer = wallet.connect(provider);
      setContract(new Contract(process.env.NEXT_PUBLIC_RECLAIM_ADDRESS!,artifacts.abi,signer));
    }
  },[provider])
 
  return (
    <>
      {/* Display QR code when URL is available */}
      {requestUrl && (
        <div style={{ margin: '20px 0' }}>
          <QRCode value={requestUrl} />
        </div>
      )}
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={getVerificationReq}>Get Verification Request</button>
      {proofs && hasProof && (
        <div className='flex flex-col space-y-4 mt-6'>
          <h2 className='text-center font-bold'>Verification Successful!</h2>
          <div className='w-full overflow-x-auto'>{JSON.stringify(proofs, null, 2)}</div>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-center' onClick={getSolidityProof}>Get Solidity Proof</button>
        </div>
      )}
    </>
  );
}
 
export default ReclaimDemo;