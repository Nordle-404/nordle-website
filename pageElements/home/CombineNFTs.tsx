import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { useContractRead } from 'wagmi';
import { NORDLE_CONTRACT_ADDRESS } from '../../utils/constants';
import Nordle from '../../contracts/Nordle.json';
import { useNordleNFTContext } from '../../contexts/NordleNFTContext';
import Image from 'next/image';

const combineWordsButtonVariants: Variants = {
    initial: {
        scale: 1,
        opacity: 0.7,
    },
    hover: {
        scale: 1.05,
        opacity: 1,
    },
};

export const CombineNFTs: FC = () => {
    const {
        userTokens,
        isLoadingUserTokens,
        isLoadingCombineWords,
        selectedTokens,
        handleCombineWords,
        combineTxHash,
    } = useNordleNFTContext();

    return (
        <>
            {/* {showMintPopup && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-row items-center justify-center bg-black/80">
                    <div className="relative w-fit bg-off-white py-20 px-32 text-center">
                        <button
                            disabled={isLoadingMintRandomWord}
                            className="absolute top-3 right-5 text-2xl"
                            onClick={() => setShowMintPopup(false)}
                        >
                            &#10006;
                        </button>
                        <p className="mb-10 text-5xl">Random New Word</p>
                        {mintTxHash && (
                            <p className="mb-5 text-xl">
                                Tx:{' '}
                                <a
                                    href={`https://goerli.etherscan.io/tx/${mintTxHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold underline"
                                >
                                    [{mintTxHash.slice(0, 4)}...
                                    {mintTxHash.slice(mintTxHash.length - 4)}]
                                </a>
                            </p>
                        )}
                        <motion.button
                            variants={mintButtonVariants}
                            disabled={!handleMintRandomWord}
                            initial="initial"
                            whileHover="hover"
                            className="w-full bg-off-black py-5 px-10 text-3xl text-off-white"
                            onClick={handleMintRandomWord}
                        >
                            {isLoadingMintRandomWord ? 'Minting...' : 'Mint'}
                        </motion.button>
                    </div>
                </div>
            )} */}
            <div className="mt-20">
                <h2 className="mb-4 text-5xl font-bold underline">Combine Nords</h2>
                <h2 className="mb-12 text-1xl font-bold text-red-300">Nords will be combined in the sequence they are selected.</h2>
                <div className="mb-4">
                    {isLoadingUserTokens ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="flex items-start gap-4">
                            {selectedTokens.map((tokenId) => (
                                <div className="py-4 px-6 bg-pink-500/60" key={tokenId}>
                                    <h2 className="font-bold text-white">{`ID ${userTokens[tokenId].tokenId}`}</h2>
                                    <div className="w-full text-white whitespace-nowrap">
                                        {`"${decodeURIComponent(userTokens[tokenId].word)}"`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    {
                        selectedTokens.length > 0 ? (<>
                        <motion.button
                            variants={combineWordsButtonVariants}
                            disabled={!handleCombineWords && !isLoadingCombineWords}
                            initial="initial"
                            whileHover="hover"
                            className="w-80 bg-off-black py-4 px-10 text-3xl text-off-white cursor-pointer"
                            onClick={() => handleCombineWords ? handleCombineWords() : null}
                        >
                            {isLoadingCombineWords ? 'Combining...' : 'Combine'}
                        </motion.button>
                        {combineTxHash && (
                            <p className="mb-5 text-xl">
                                Tx:{' '}
                                <a
                                    href={`https://goerli.etherscan.io/tx/${combineTxHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold underline"
                                >
                                    [{combineTxHash.slice(0, 4)}...
                                    {combineTxHash.slice(combineTxHash.length - 4)}]
                                </a>
                            </p>
                        )}
                        </>) : <h2 className="text-xl font-bold">Select Nords...</h2>
                    }
                </div>
            </div>
        </>
    );
};
