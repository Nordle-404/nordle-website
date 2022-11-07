import { FC } from 'react';
import { useContractRead } from 'wagmi';
import { NORDLE_CONTRACT_ADDRESS } from '../../utils/constants';
import Nordle from '../../contracts/Nordle.json';
import { useNordleNFTContext } from '../../contexts/NordleNFTContext';
import Image from 'next/image';

export const CombineNFTs: FC = () => {
    const { isLoadingUserTokens, selectedTokens } = useNordleNFTContext();

    return (
        <div className="mt-20">
            <h2 className="mb-4 text-5xl font-bold underline">Combine Nords</h2>
            <h2 className="mb-12 text-1xl font-bold text-red-300">Nords will be combined in the sequence they are selected.</h2>
            <div>
                {isLoadingUserTokens ? (
                    <p>Loading...</p>
                ) : (
                    <div className="flex space-x-2">
                        {selectedTokens.map((tokenId) => (
                            <div className="w-20 h-12" key={tokenId}>
                                <h2>{tokenId}</h2>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
