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

  const FIRST_PROVIDER_ID = process.env.NEXT_PUBLIC_FIRST_PROVIDER_ID!;
  const SECOND_PROVIDER_ID = process.env.NEXT_PUBLIC_SECOND_PROVIDER_ID!;
  const THIRD_PROVIDER_ID = process.env.NEXT_PUBLIC_THIRD_PROVIDER_ID!;

  const renderStatusMobile = (proof: any, balance: any, id: number) => {
    if (balance && balance > BigInt(0)) {
      return <div className="text-center animate-shine-once">Token ottenuto <AiOutlineCheck className="inline text-green" /></div>;
    }
    if (proof) {
      return (
        <>
          <button
            className='text-blue-500'
            onClick={() => {
              setModalProof(proof);
              setIsOpen(true);
            }}
          >
            Visualizza la Prova
          </button>
          <div className="md:hidden">
            <ClaimToken proof={proof} id={id} />
          </div>
        </>
      );
    }
    return (
      <>
        <div className="text-center">Prova mancante <AiOutlineCloseCircle className="inline text-red" /></div>
        <div className="md:hidden">
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
      </>
    );
  };

  const renderStatusDesktop = (proof: any, balance: any, id: number) => {
    if (balance && balance > BigInt(0)) {
      return <div className="text-center animate-shine-once">Token ottenuto <AiOutlineCheck className="inline text-green" /></div>;

    }
    if (proof) {
      return (
        <div className="flex flex-col gap-2">
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
      <div className="flex flex-col gap-2">
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
    <div className="min-h-screen flex flex-col items-center pt-10 md:pt-32 px-4 md:px-10 gap-y-2 md:gap-y-8">
      <ReclaimQR requestUrl={requestUrl} />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row items-center justify-center gap-x-12">
        <div className='flex flex-col gap-y-4 h-full'>
          <h2 className="text-center font-bold">Punti Patente</h2>
          {renderStatusDesktop(proofOne, b1, 0)}
        </div>

        <div className='flex flex-col gap-y-4 h-full'>
          <h2 className="text-center font-bold">Donazione</h2>
          {renderStatusDesktop(proofTwo, b2, 1)}
        </div>

        <div className='flex flex-col gap-y-4 h-full'>
          <h2 className="text-center font-bold">Carbon Footprint</h2>
          {renderStatusDesktop(proofThree, b3, 2)}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        <table className="w-full">
          <tbody>
            {/* Punti Patente Row */}
            <tr className="border-b">
              <td className="py-4">
                <div className="flex flex-col items-center gap-4">
                  <h2 className="font-bold">Punti Patente</h2>
                  {renderStatusMobile(proofOne, b1, 0)}
                </div>
              </td>
            </tr>

            {/* Donazione Row */}
            <tr className="border-b">
              <td className="py-4">
                <div className="flex flex-col items-center gap-4">
                  <h2 className="font-bold">Donazione</h2>
                  {renderStatusMobile(proofTwo, b2, 1)}
                </div>
              </td>
            </tr>

            {/* Carbon Footprint Row */}
            <tr className="border-b">
              <td className="py-4">
                <div className="flex flex-col items-center gap-4">
                  <h2 className="font-bold">Carbon Footprint</h2>
                  {renderStatusMobile(proofThree, b3, 2)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isOpen && <ProofSection setIsOpen={setIsOpen} proof={modalProof} />}
    </div>
  );
}