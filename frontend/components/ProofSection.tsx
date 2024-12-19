import { Proof } from "@reclaimprotocol/js-sdk";

type ProofSectionProps = {
    proof: Proof|string|undefined;
}

export default function ProofSection(props: ProofSectionProps) {
    return (
      <div className="mt-6 p-4 bg-gray-300">
        {
            props.proof?
                <div>
                    {JSON.stringify(props.proof)}
                </div>
                :
                <div>
                    Proof not generated
                </div>
        }
      </div>
    );
}