import { FC } from 'react';
import { useContractRead } from 'wagmi';
import { NORDLE_CONTRACT_ADDRESS } from '../../utils/constants';
import Nordle from '../../contracts/Nordle.json';
import { useNordleNFTContext } from '../../contexts/NordleNFTContext';
import Image from 'next/image';

export const UserNFTs: FC = () => {
    const { isLoadingUserTokens, userTokens } = useNordleNFTContext();

    return (
        <div>
            <h2>User NFTs</h2>
            <div>
                {isLoadingUserTokens ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {userTokens.map(({ tokenId, tokenURI, word }) => {
                            return (
                                <div key={tokenId}>
                                    <p>Token Id: {tokenId}</p>
                                    <p>Word: {word}</p>
                                    <img
                                        src={tokenURI}
                                        alt="tokenURI"
                                        height={100}
                                        width={100}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
