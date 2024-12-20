import { Proof, transformForOnchain } from "@reclaimprotocol/js-sdk";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import artifacts from "../abi/Attestor.json";
import addresses from "../shared/data/addresses.json";

type ClaimSectionProps = {
    proof: Proof|string|undefined;
}

export default function ClaimSection(props: ClaimSectionProps) {

    const account = useAccount();
    const { data: hash, writeContractAsync } = useWriteContract();
    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash})

    const getSolidityProof = async () => {

        console.log(transformForOnchain(props.proof!))
    
        await writeContractAsync({
            address: addresses["Attestor"] as `0x${string}`,
            abi: artifacts.abi,
            functionName: 'mint',
            args: [
                account.address,
                0,
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                transformForOnchain(props.proof!)
            ],
          })
    
      };

    return (
        <div className="mt-6">
            { 
                props.proof != undefined ?
                <div className="flex flex-col items-center">
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-center' onClick={getSolidityProof}>Verify Proof On-Chain</button>               
                    {
                        isConfirmed?
                         <div className="mt-3">Token minted with tx: {hash}</div>
                         :
                         <></>
                    }
                </div>
                :
                <></>
            }
            
        </div>
    );
}