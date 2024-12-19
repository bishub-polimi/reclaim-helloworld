import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
    return (
      <div className="w-full p-4 flex justify-end">
        <ConnectButton />
      </div>
    );
}