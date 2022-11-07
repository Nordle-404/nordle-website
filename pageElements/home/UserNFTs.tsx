import { FC } from 'react';
import { useContractRead } from 'wagmi';
import { NORDLE_CONTRACT_ADDRESS } from '../../utils/constants';
import Nordle from '../../contracts/Nordle.json';
import { useNordleNFTContext } from '../../contexts/NordleNFTContext';
import Image from 'next/image';
import { NFTCard } from './NFTCard';

export const UserNFTs: FC = () => {
    const { isLoadingUserTokens, userTokens } = useNordleNFTContext();

    return (
        <div>
            <h2 className="mb-20 text-5xl font-bold underline">Your Nords</h2>
            <div>
                {isLoadingUserTokens ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-4 justify-items-center gap-x-2 gap-y-10">
                        {userTokens.map((nordleNFTData) => (
                            <NFTCard
                                key={nordleNFTData.tokenId}
                                nordleNFTData={nordleNFTData}
                            />
                        ))}
                        <NFTCard
                            isMintButton
                            nordleNFTData={{
                                tokenId: -1,
                                tokenURI: '',
                                word: 'Mint',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
