import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import { useState } from "react";
import artifacts from "../abi/Testmint.json";
import addresses from "../shared/data/addresses.json";

const CONTRACT_ADDRESS = "0x60dF8978e207969654Ea7C07794A444fcc1Cd01F";

export default function TestMint() {
    const account = useAccount();
    const [smartWalletHash, setSmartWalletHash] = useState<string>();

    const chainId = useChainId();
    const testMintAddress = chainId === 1337
        ? addresses["Testmint#Testmint"] as `0x${string}`
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

    const handleMint = async () => {
        const args = [
            account.address,
            0,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        ];

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
                        address: testMintAddress,
                        abi: artifacts.abi,
                        functionName: 'mint',
                        args
                    }],

                    capabilities
                });
            } else {
                await writeContractAsync({
                    address: testMintAddress,
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
        <div className="flex flex-col items-center mt-6">
            <button
                className="bg-green hover:bg-green/80 text-white font-bold py-2 px-4 rounded-full"
                onClick={handleMint}
            >
                Test Mint
            </button>

            <div className="mt-4 text-center">
                {isConfirmed && !smartWalletHash && (
                    <div>
                        <span className="font-semibold">Token mintato con tx: </span>
                        <span className="text-sm opacity-75">{hash}</span>
                    </div>
                )}

                {smartWalletHash && (
                    <div>
                        <span className="font-semibold">Token mintato con user operation: </span>
                        <span className="text-sm opacity-75">{smartWalletHash}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
