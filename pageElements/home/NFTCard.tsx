import { FC, useState } from 'react';
import { CardWithShadow } from '../../components/cards/CardWithShadow';
import { NordleNFT } from '../../types/Nordle.type';
import { motion, Variants } from 'framer-motion';
import { useNordleNFTContext } from '../../contexts/NordleNFTContext';

const tokenURIVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

const mintButtonVariants: Variants = {
    initial: {
        scale: 1,
        opacity: 0.7,
    },
    hover: {
        scale: 1.05,
        opacity: 1,
    },
};

type NFTCardProps = {
    nordleNFTData: NordleNFT;
    isMintButton?: boolean;
};

export const NFTCard: FC<NFTCardProps> = ({
    nordleNFTData: { tokenId, tokenURI, word },
    isMintButton = false,
}) => {
    const {
        handleMintRandomWord,
        isLoadingMintRandomWord,
        isSuccessMintRandomWord,
        mintTxHash,
    } = useNordleNFTContext();

    const [showMintPopup, setShowMintPopup] = useState(false);

    return (
        <>
            {showMintPopup && (
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
                                    rel="no_referrer"
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
            )}
            <CardWithShadow animateWhile="hover">
                <div
                    className="relative  flex h-96 w-80 cursor-pointer flex-col items-center justify-center"
                    key={tokenId}
                    onClick={
                        isMintButton ? () => setShowMintPopup(true) : undefined
                    }
                >
                    {!isMintButton && (
                        <motion.img
                            variants={tokenURIVariants}
                            initial="hidden"
                            whileHover="visible"
                            src={tokenURI}
                            className="absolute h-full w-full opacity-0"
                        />
                    )}
                    <p className="text-center text-5xl font-bold uppercase underline">
                        {decodeURI(word)}
                    </p>
                </div>
            </CardWithShadow>
        </>
    );
};
