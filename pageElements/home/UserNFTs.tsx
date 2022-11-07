import { useCallback, useState, FC } from 'react';
import { useContractRead } from 'wagmi';
import { NORDLE_CONTRACT_ADDRESS } from '../../utils/constants';
import Nordle from '../../contracts/Nordle.json';
import { useNordleNFTContext } from '../../contexts/NordleNFTContext';
import Image from 'next/image';
import { NFTCard } from './NFTCard';

export const UserNFTs: FC = () => {
    const {
        isLoadingUserTokens,
        userTokens,
        selectedTokens,
        setSelectedTokens,
    } = useNordleNFTContext();

    const [isSelected, setIsSelected] = useState<{ [key: number]: boolean }>(
        {}
    );

    const selectToken = useCallback(
        (tokenId: number) => {
            if (selectedTokens.includes(tokenId)) {
                // remove token ID
                setSelectedTokens(selectedTokens.filter((id) => id != tokenId));
                setIsSelected({ ...isSelected, [tokenId]: false });
            } else {
                // add token ID
                setSelectedTokens([...selectedTokens, tokenId]);
                setIsSelected({ ...isSelected, [tokenId]: true });
            }
        },
        [setSelectedTokens, selectedTokens]
    );

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
                                // selectToken={selectToken}
                                // isSelected={isSelected[nordleNFTData.tokenId]}
                            />
                        ))}
                        <NFTCard
                            isMintButton
                            nordleNFTData={{
                                tokenId: -1,
                                tokenURI: '',
                                word: 'Mint',
                                isSelected: false,
                                selectToken: () => {},
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
