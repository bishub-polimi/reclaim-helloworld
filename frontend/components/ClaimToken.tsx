import { Proof, transformForOnchain } from "@reclaimprotocol/js-sdk";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
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

    const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
        address: attestorAddress,
        abi: artifacts.abi,
        functionName: 'balanceOf',
        args: [account.address, props.id],
        query: {
            enabled: false,
        }
    });

    const checkTokenBalance = async (maxAttempts = 5) => {
        addNotification('In attesa del token...', 'success');
        let attempts = 0;
        const checkBalance = async () => {
            const { data: balance } = await refetchBalance();
            console.log("Current token balance:", balance);
            if (balance > 0) {
                return true;
            }
            attempts++;
            if (attempts >= maxAttempts) {
                addNotification('Minting del token fallito', 'error');
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            return checkBalance();
        };
        return checkBalance();
    };


    // hook per eoa
    const { data: hash, writeContractAsync, isPending, isSuccess: isSent } = useWriteContract({
        onError: (error: { message: string; }) => {
            console.error("[ClaimToken] Transaction Error:", error);
            const errorMessage = `Errore durante la transazione: ${error.message.split('\n')[0]}`;
            addNotification(errorMessage, 'error');
        }
    });


    // hook per cb wallet
    const { writeContractsAsync, isPending: isPendingCB } = useWriteContracts({
        mutation: {
            onError: (error: Error) => {
                console.error("[ClaimToken] UserOperation Error:", error);
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

                setTimeout(async () => {
                    await checkTokenBalance();
                }, 3000);

            } else {
                const result = await writeContractAsync({
                    address: attestorAddress,
                    abi: artifacts.abi,
                    functionName: 'mint',
                    args
                });

                setTimeout(() => {
                    addNotification(`Transazione inviata: `, 'success', result);
                    console.log("Transaction result:", result);
                }, 1500);

                setTimeout(async () => {
                    await checkTokenBalance();
                }, 3000);

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