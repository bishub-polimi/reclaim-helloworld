"use client"

import { Proof } from "@reclaimprotocol/js-sdk";
import { useState } from "react";
import ProofSection from "./ProofSection";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import ReclaimProvider from "./ReclaimProvider";
import ReclaimQR from "./ReclaimQR";
import ClaimToken from "./ClaimToken";
import { useAccount, useReadContract } from "wagmi";
import artifacts from "../abi/Attestor.json";
import ClaimBadge from "./ClaimBadge";

export default function UserProfile() {
  const [proofOne, setProofOne] = useState<Proof | string>();
  const [proofTwo, setProofTwo] = useState<Proof | string>();
  const [proofThree, setProofThree] = useState<Proof | string>();
  const [requestUrl, setRequestUrl] = useState('');
  const [modalProof, setModalProof] = useState<Proof | string>();
  const [isOpen, setIsOpen] = useState(false);

  const account = useAccount();
  const attestorAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

  const { data: b1 } = useReadContract({
    address: attestorAddress,
    abi: artifacts.abi,
    functionName: 'balanceOf',
    args: [account.address, 0],
  })

  const { data: b2 } = useReadContract({
    address: attestorAddress,
    abi: artifacts.abi,
    functionName: 'balanceOf',
    args: [account.address, 1],
  })

  const { data: b3 } = useReadContract({
    address: attestorAddress,
    abi: artifacts.abi,
    functionName: 'balanceOf',
    args: [account.address, 2],
  })

  const { data: b4 } = useReadContract({
    address: attestorAddress,
    abi: artifacts.abi,
    functionName: 'balanceOf',
    args: [account.address, 3],
  })

  const FIRST_PROVIDER_ID = process.env.NEXT_PUBLIC_FIRST_PROVIDER_ID!;
  const SECOND_PROVIDER_ID = process.env.NEXT_PUBLIC_SECOND_PROVIDER_ID!;
  const THIRD_PROVIDER_ID = process.env.NEXT_PUBLIC_THIRD_PROVIDER_ID!;


  const renderStatus = (proof: any, balance: any, id: number) => {
    if (balance && balance > BigInt(0)) {
      return <div className="text-center animate-shine-once">Token ottenuto <AiOutlineCheck className="inline text-green" /></div>;

    }
    if (proof) {
      return (
        <div className="flex flex-col gap-4">
          <button
            className='text-blue-500'
            onClick={() => {
              setModalProof(proof);
              setIsOpen(true);
            }}
          >
            Visualizza la Prova
          </button>
          <ClaimToken proof={proof} id={id} />
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">Prova mancante <AiOutlineCloseCircle className="inline text-red" /></div>
        <ReclaimProvider
          setProof={
            id === 0 ? setProofOne :
              id === 1 ? setProofTwo :
                setProofThree
          }
          setRequestUrl={setRequestUrl}
          providerID={
            id === 0 ? FIRST_PROVIDER_ID :
              id === 1 ? SECOND_PROVIDER_ID :
                THIRD_PROVIDER_ID
          }
        />
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-10 gap-y-7 py-7">
      <ReclaimQR requestUrl={requestUrl} />

      <div className="flex flex-col md:flex-row items-center justify-center gap-x-12 max-sm:w-full">

        <div className='flex flex-col gap-y-4 h-full py-4'>
          <h2 className="text-center font-bold">Alpha Tester</h2>
          {
            b4 && b4 > BigInt(0) ?
            <div className="text-center animate-shine-once">Badge ottenuto <AiOutlineCheck className="inline text-green" /></div>
            :
            <div className="flex flex-col gap-4">
              <div className="text-center">Badge non riscattato <AiOutlineCloseCircle className="inline text-red" /></div>
              <ClaimBadge />
            </div>
          }
        </div>

        <div className='flex flex-col gap-y-4 h-full py-4 max-sm:w-full max-sm:border-b-2 max-sm:border-grey'>
          <h2 className="text-center font-bold">Punti Patente</h2>
          {renderStatus(proofOne, b1, 0)}
        </div>

        <div className='flex flex-col gap-y-4 h-full py-4 max-sm:w-full max-sm:border-b-2 max-sm:border-grey'>
          <h2 className="text-center font-bold">Donazione</h2>
          {renderStatus(proofTwo, b2, 1)}
        </div>

        <div className='flex flex-col gap-y-4 h-full py-4 max-sm:w-full max-sm:border-b-2 max-sm:border-grey'>
          <h2 className="text-center font-bold">Carbon Footprint</h2>
          {renderStatus(proofThree, b3, 2)}
        </div>

      </div>  

      {isOpen && <ProofSection setIsOpen={setIsOpen} proof={modalProof} />}
    </div>
  );
}