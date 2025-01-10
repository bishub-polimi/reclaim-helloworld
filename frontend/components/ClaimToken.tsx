import { Proof, transformForOnchain } from "@reclaimprotocol/js-sdk";
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useChainId } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import artifacts from "../abi/Attestor.json";
import addresses from "../shared/data/addresses.json";
import { useState } from 'react';

type ClaimSectionProps = {
    proof: Proof|string|undefined;
    id: number
}

const CONTRACT_ADDRESS = "0xFf055825cDaB483114A3cAaA6Fbd1279b18AD304"; 

export default function ClaimToken(props: ClaimSectionProps) {

    const account = useAccount();
        const [smartWalletHash, setSmartWalletHash] = useState<string>();
    
        const chainId = useChainId();
        const attestorAddress = chainId === 1337
            ? addresses["Attestor#Attestor"] as `0x${string}`
            : CONTRACT_ADDRESS as `0x${string}`;
    
        // hook per eoa
        const { data: hash, writeContractAsync } = useWriteContract();
        const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
            hash
        });
    
        // hook sperimentale per cb smart wallet
        const { writeContracts } = useWriteContracts({
            mutation: {
                onSuccess: (hash) => setSmartWalletHash(hash)
            }
        });
    

    const getSolidityProof = async () => {
        const args = [
            account.address,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            transformForOnchain(props.proof!)
        ];

        console.log("debug * proof ", transformForOnchain(props.proof!));
        console.log("debug * attestor contract address ", attestorAddress);

        try {
            if (account.connector?.type === 'coinbaseWallet') {
                console.log("account type:", account.connector?.type);

                const capabilities = {
                    paymasterService: {
                        url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT
                    }
                };

                console.log(capabilities)

                writeContracts({
                    contracts: [{
                        address: attestorAddress,
                        abi: artifacts.abi,
                        functionName: 'mint',
                        args
                    }],

                    capabilities
                });
                console.log("debug * capabilities", capabilities);
            } else {
                await writeContractAsync({
                    address: attestorAddress,
                    abi: artifacts.abi,
                    functionName: 'mint',
                    args
                });
            }
        } catch (error: any) {
            console.error("[TestMint] Error:", error);
        }
    
      };

      return (
        <div>
            <button 
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-center' 
                onClick={getSolidityProof}
            >
                Claim
            </button>
    
            <div className="mt-4 text-center">
                {isConfirmed && !smartWalletHash && (
                    <div>
                        <span className="font-semibold">Token mintato con tx: </span>
                        <span className="text-sm opacity-75">{hash ? hash.slice(0, 15) + "..." : ""}</span>
                    </div>
                )}
    
                {smartWalletHash && (
                    <div>
                        <span className="font-semibold">Token mintato con userOp: </span>
                        <span className="text-sm opacity-75">{smartWalletHash ? smartWalletHash.slice(0, 15) + "..." : ""}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
