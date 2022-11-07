import { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const BasicNavbar: FC = () => {
    return (
        <nav className="sticky top-0 z-50 flex flex-row items-center justify-between border-b-2 border-off-black bg-off-white px-width-clamp py-4">
            <p className="text-2xl">NORDLE</p>
            <ConnectButton
                chainStatus="none"
                showBalance={false}
                accountStatus="address"
            />
        </nav>
    );
};
