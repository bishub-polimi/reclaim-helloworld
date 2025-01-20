import { Proof, transformForOnchain } from "@reclaimprotocol/js-sdk";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import {useEffect} from "react";
import artifacts from "../abi/Attestor.json";
import NotificationBanner from "./NotificationBanner";
import { useNotifications } from "@/hooks/useNotifications";

type ClaimSectionProps = {
    proof: Proof | string | undefined;
    id: number
}

export default function ClaimToken(props: ClaimSectionProps) {
    const account = useAccount();
    const { notifications, addNotification, removeNotification } = useNotifications();
    const attestorAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

    const getRevertMessage = (error: Error) => {
        const match = error.message.match(/execution reverted: (.*?)(?:\.|\n|$)/);
        if (match?.[1]) {
            return match[1];
        }
        return error.message;
    };

    // hook per eoa
    const { data: hash, writeContractAsync, isPending, isSuccess: isSent, error } = useWriteContract();
    const { isSuccess: isConfirmed, data: receipt, error: waitError, isError } = useWaitForTransactionReceipt({
        hash,
        enabled: !!hash
    });

    useEffect(() => {
        if (isError && waitError && hash) { 
            console.log('Transaction reverted:', waitError);
            addNotification(`${getRevertMessage(waitError)}`, 'error');
        }
    }, [isError, waitError, hash]);


    // hook per cb wallet
    const { writeContractsAsync, isPending: isPendingCB } = useWriteContracts({
        mutation: {
            onError: (error: Error) => {
                console.error("[ClaimToken] User Operation Error:", error);
                const errorMessage = `Errore durante l'invio: ${error.message.split('\n')[0]}`;
                addNotification(errorMessage, 'error');
            }
        }
    });


    const getSolidityProof = async () => {
        const args = [
            account.address,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            transformForOnchain(props.proof!)
        ];

        try {
            if (account.connector?.type === 'coinbaseWallet') {
                const capabilities = {
                    paymasterService: {
                        url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT
                    }
                };

                addNotification(`Invio User Operation in corso...`, 'success');
                const result = await writeContractsAsync({
                    contracts: [{
                        address: attestorAddress,
                        abi: artifacts.abi,
                        functionName: 'mint',
                        args
                    }],
                    capabilities
                });

                setTimeout(() => {
                    addNotification(`User Operation inviata: `, 'success', result);
                    console.log("UserOperation result:", result);
                }, 1500);

                setTimeout(() => {
                    addNotification(`In attesa del minting...`, 'success');
                }, 1500);

            } else {
                const result = await writeContractAsync({
                    address: attestorAddress,
                    abi: artifacts.abi,
                    functionName: 'mint',
                    args
                });

                setTimeout(() => {
                    addNotification(`Transazione inviata: `, 'success', result);
                    addNotification(`In attesa del minting...`, 'success');
                    console.log("Transaction result:", result);
                }, 1500);

                setTimeout(() => {
                    addNotification(`In attesa del minting...`, 'success');
                }, 1500);

            }
        } catch (error: any) {
            console.error("[ClaimToken] Error:", error);
            const errorMessage = `Errore durante il mint: ${error.message.split('\n')[0]}`;
            addNotification(errorMessage, 'error');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <NotificationBanner
                notifications={notifications}
                onClose={removeNotification}
            />

            <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
                onClick={getSolidityProof}
                disabled={isPending || isPendingCB}
            >
                {isPending || isPendingCB ? 'Minting...' : 'Ottieni il Token'}
            </button>
        </div>
    );
}