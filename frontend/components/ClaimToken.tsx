import { Proof, transformForOnchain } from "@reclaimprotocol/js-sdk";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import { useEffect } from "react";
import artifacts from "../abi/Attestor.json";
import NotificationBanner from "./NotificationBanner";
import { useNotifications, extractMainHash } from "@/hooks/useNotifications";

type ClaimSectionProps = {
    proof: Proof | string | undefined;
    id: number
}

export default function ClaimToken(props: ClaimSectionProps) {
    const account = useAccount();
    const { notifications, addNotification, removeNotification } = useNotifications();

    const attestorAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

    // hook per eoa
    const { data: hash, writeContractAsync, isPending, isSuccess: isSent, error } = useWriteContract({
        onError: (error) => {
            console.error("[ClaimToken] Transaction Error:", error);
            const errorMessage = `Errore durante il mint: ${error.message.split('\n')[0]}`;
            addNotification(errorMessage, 'error');
        }
    });

    const { isSuccess: isConfirmed, data: receipt, error: receiptError } = useWaitForTransactionReceipt({
        hash,
        enabled: !!hash
    });

    useEffect(() => {
        if (receiptError) {
            console.error("[ClaimToken] Transaction failed:", receiptError);
            const errorMessage = receiptError.message.includes("execution reverted")
            ? `Errore: Transazione fallita (execution reverted) - ${receiptError.message}`
            : `Errore durante il mint: ${receiptError.message}`;
            addNotification(errorMessage, 'error');
        }
    }, [receiptError]);


    useEffect(() => {
        if (isSent && hash) {
            console.log("Transaction sent:", hash);
            addNotification(`Transazione inviata! In attesa di conferma...`, 'success', hash, account.connector?.type);
        }
    }, [isSent, hash]);

    useEffect(() => {
        if (isConfirmed && receipt) {
            console.log("Transaction confirmed:", receipt);
            setTimeout(() => {
                addNotification(`Token mintato con successo! TX: `, 'success', receipt.transactionHash, account.connector?.type);
            }, 1500);
        }
    }, [isConfirmed, receipt]);

    const { writeContracts, isPending: isPendingCB } = useWriteContracts({
        mutation: {
            onSuccess: (hash: string) => {
                const mainHash = extractMainHash(hash);
                addNotification(`User Operation inviata! In attesa di conferma...`, 'success', mainHash);
            },
            onError: (error: Error) => {
                console.error("[ClaimToken] UserOperation Error:", error);
                const errorMessage = `Errore durante il mint: ${error.message.split('\n')[0]}`;
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

                writeContracts({
                    contracts: [{
                        address: attestorAddress,
                        abi: artifacts.abi,
                        functionName: 'mint',
                        args
                    }],
                    capabilities
                });
            } else {
                await writeContractAsync({
                    address: attestorAddress,
                    abi: artifacts.abi,
                    functionName: 'mint',
                    args
                });
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