import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useAccount, useContractRead, useContractReads, useToken } from 'wagmi';
import { NORDLE_CONTRACT_ADDRESS } from '../utils/constants';
import NordleArtifact from '../contracts/Nordle.json';
import {
    NordleNFT,
    UserTokenIds,
    WagmiContractConfig,
} from '../types/Nordle.type';
import { BigNumber } from 'ethers';

interface NordleNFTContextInterface {
    isLoadingUserTokens: boolean;
    userTokens: NordleNFT[];
    selectedTokens: number[];
    setSelectedTokens: Dispatch<SetStateAction<number[]>>;
}

const NordleNFTContext = createContext<NordleNFTContextInterface | undefined>(
    undefined
);

export const NordleNFTContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { address } = useAccount();

    const NordleContractConfig: WagmiContractConfig = {
        address: NORDLE_CONTRACT_ADDRESS,
        abi: NordleArtifact.abi,
        args: [address],
        functionName: '',
    };

    const {
        data: rawWagmiAllUserTokenIdsData,
        isLoading: isLoadingUserTokenIds,
        // error: userTokenIdsError,
    } = useContractReads({
        contracts: [
            {
                ...NordleContractConfig,
                functionName: 'getTokenIds',
            },
            {
                ...NordleContractConfig,
                functionName: 'getBurnedTokenIds',
            },
        ],
    });

    const [isLoadingUserTokens, setIsLoadingUserTokens] = useState(true);
    const [userTokenIds, setUserTokenIds] = useState<number[]>([]);
    const [wagmiTokenDataContractsInfo, setWagmiTokenDataContractsInfo] =
        useState<WagmiContractConfig[]>([]);
    const [userTokens, setUserTokens] = useState<NordleNFT[]>([]);
    const [fetchTokenData, setFetchTokenData] = useState(false);

    const [selectedTokens, setSelectedTokens] = useState<number[]>([]);

    const rawWagmiTokenData = useContractReads({
        contracts: wagmiTokenDataContractsInfo,
        enabled: fetchTokenData,
    });

    // Once the data is read from the contract, filter out the burned tokens
    useEffect(() => {
        if (!isLoadingUserTokenIds && rawWagmiAllUserTokenIdsData) {
            const allUserTokenIds = (
                rawWagmiAllUserTokenIdsData[0] as BigNumber[]
            ).map((bnTokenId) => bnTokenId.toNumber());
            const burnedUserTokenIds = (
                rawWagmiAllUserTokenIdsData[1] as BigNumber[]
            ).map((bnTokenId) => bnTokenId.toNumber());

            const newUserTokenIds = allUserTokenIds.filter(
                (tokenId) => !burnedUserTokenIds.includes(tokenId)
            );
            setUserTokenIds([...newUserTokenIds]);

            if (newUserTokenIds.length === 0) {
                // Token data will not be fetched so the data is fully loaded at this point
                setIsLoadingUserTokens(false);
            }

            // Set the required contract information to get tokenURI and words
            const newWagmiTokenDataContractsInfo = [];
            for (let tokenId of newUserTokenIds) {
                console.log(tokenId);
                newWagmiTokenDataContractsInfo.push({
                    ...NordleContractConfig,
                    functionName: 'tokenURI',
                    args: [tokenId],
                });
                newWagmiTokenDataContractsInfo.push({
                    ...NordleContractConfig,
                    functionName: 'tokenWords',
                    args: [tokenId],
                });
            }
            setWagmiTokenDataContractsInfo([...newWagmiTokenDataContractsInfo]);
        }
    }, [isLoadingUserTokenIds, rawWagmiAllUserTokenIdsData]);

    useEffect(() => {
        if (wagmiTokenDataContractsInfo.length > 0) {
            setFetchTokenData(true);
        }
    }, [wagmiTokenDataContractsInfo]);

    useEffect(() => {
        if (
            !rawWagmiTokenData.isLoading &&
            rawWagmiTokenData.data &&
            userTokens.length === 0 // Only run once - Kinda hacky
        ) {
            const wagmiTokenData = rawWagmiTokenData.data as string[];
            const newUserTokenData: NordleNFT[] = [];
            for (let i = 0; i < userTokenIds.length; i++) {
                const tokenId = userTokenIds[i];
                newUserTokenData.push({
                    tokenId,
                    tokenURI: wagmiTokenData[2 * i],
                    word: wagmiTokenData[2 * i + 1],
                });
            }
            console.log(newUserTokenData);
            setUserTokens([...newUserTokenData]);
            setIsLoadingUserTokens(false);
        }
    }, [rawWagmiTokenData]);

    return (
        <NordleNFTContext.Provider
            value={{
                isLoadingUserTokens,
                userTokens,
                selectedTokens,
                setSelectedTokens,
            }}
        >
            {children}
        </NordleNFTContext.Provider>
    );
};

export const useNordleNFTContext = (): NordleNFTContextInterface => {
    const context = useContext(NordleNFTContext);
    if (context === undefined) {
        throw new Error(
            'NordleNFTContext must be within NordleNFTContextProvider'
        );
    }

    return context;
};
