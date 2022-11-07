import { FC } from 'react';
import { CardWithShadow } from '../../components/cards/CardWithShadow';
import { NordleNFT } from '../../types/Nordle.type';

export const NFTCard: FC<NordleNFT> = ({ tokenId, tokenURI, word }) => {
    return (
        <CardWithShadow animateWhile="hover">
            <div className="relative flex h-full w-80 flex-col" key={tokenId}>
                <img src={tokenURI} alt="tokenURI" className="" />
                <div className="absolute top-0 right-0 flex h-10 w-10 flex-row items-center justify-center bg-off-black text-xl text-off-white ">
                    {tokenId}
                </div>
                <div className=" flex-grow border-t-4 bg-white px-5 py-3">
                    <p className="text-xl font-bold leading-5">
                        "{decodeURI(word)}"
                    </p>
                </div>
            </div>
        </CardWithShadow>
    );
};
