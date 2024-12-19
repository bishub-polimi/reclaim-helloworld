import { Proof } from "@reclaimprotocol/js-sdk";
import VerificationRequest from "./VerificationRequest";
import { useState } from "react";
import ProofSection from "./ProofSection";
import ClaimSection from "./ClaimSection";

export default function ReclaimSection() {

    const [proof, setProof] = useState<Proof|string>();

    return (
      <div className="h-full flex flex-col items-center justify-center px-10">
        <VerificationRequest setProof={setProof} hidden={proof?true:false}/>
        <ProofSection proof={proof}/>
        <ClaimSection proof={proof}/>
      </div>
    );
}