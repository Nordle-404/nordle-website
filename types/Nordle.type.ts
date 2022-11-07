import { BigNumber } from 'ethers';

export interface UserTokenIds {
    userTokenIds: BigNumber[];
    userBurnedTokenIds: BigNumber[];
}

export interface NordleNFT {
    tokenId: number;
    tokenURI: string;
    word: string;
    selectToken(tokenId: number): void;
    isSelected: boolean;
}

export interface WagmiContractConfig {
    address: string;
    abi: any;
    args: any[];
    functionName: string;
}
