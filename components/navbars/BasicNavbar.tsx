import { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import nordleLogo from '../../assets/logo.png';
import Image from 'next/image';

export const BasicNavbar: FC = () => {
    return (
        <nav className="sticky top-0 z-50 flex flex-row items-center justify-between border-b-2 border-off-black bg-off-white px-width-clamp py-4">
            <div className="flex items-center space-x-6 cursor-default select-none">
                <Image src={nordleLogo} alt="Nordle Logo" height={60} width={50} />
                <h2 className="text-[#3FC4C4] text-2xl font-bold">Nordle</h2>
            </div>
            <ConnectButton
                chainStatus="none"
                showBalance={false}
                accountStatus="address"
            />
        </nav>
    );
};
