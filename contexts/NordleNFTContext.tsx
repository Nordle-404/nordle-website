import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useCallback,
    useState,
    useMemo,
} from 'react';
import {
    useAccount,
    useContractRead,
    useContractReads,
    useContractWrite,
    usePrepareContractWrite,
    useToken,
    useWaitForTransaction,
} from 'wagmi';
import { NORDLE_CONTRACT_ADDRESS } from '../utils/constants';
import NordleArtifact from '../contracts/Nordle.json';
import {
    NordleNFT,
    NordleUserTokens,
    UserTokenIds,
    WagmiContractConfig,
} from '../types/Nordle.type';
import { BigNumber } from 'ethers';

interface NordleNFTContextInterface {
    isLoadingUserTokens: boolean;
    userTokens: NordleUserTokens;
    handleMintRandomWord: (() => Promise<void>) | undefined;
    handleCombineWords: (() => Promise<void>) | undefined;
    isLoadingMintRandomWord: boolean;
    isSuccessMintRandomWord: boolean;
    isLoadingCombineWords: boolean;
    isSuccessCombineWords: boolean;
    mintTxHash: string;
    combineTxHash: string;
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

    const NordleContractConfig = useMemo(() => ({
        address: NORDLE_CONTRACT_ADDRESS,
        abi: NordleArtifact.abi,
        args: [address],
        functionName: '',
    } as WagmiContractConfig), [address]);

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
    const [userTokens, setUserTokens] = useState<NordleUserTokens>({});
    const [fetchTokenData, setFetchTokenData] = useState(false);
    const [mintTxHash, setMintTxHash] = useState('');
    const [combineTxHash, setCombineTxHash] = useState('');

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
    }, [isLoadingUserTokenIds, rawWagmiAllUserTokenIdsData, NordleContractConfig]);

    // Enable to contract reads to fetch the token data
    useEffect(() => {
        if (wagmiTokenDataContractsInfo.length > 0) {
            setFetchTokenData(true);
        }
    }, [wagmiTokenDataContractsInfo]);

    // Parse the token URIs and words
    useEffect(() => {
        if (
            !rawWagmiTokenData.isLoading &&
            rawWagmiTokenData.data &&
            Object.values(userTokens).length === 0 // Only run once - Kinda hacky
        ) {
            const wagmiTokenData = rawWagmiTokenData.data as string[];
            const newUserTokenData: NordleUserTokens = {};
            for (let i = 0; i < userTokenIds.length; i++) {
                const tokenId = userTokenIds[i];
                newUserTokenData[tokenId] = {
                    tokenId,
                    tokenURI: wagmiTokenData[2 * i],
                    word: wagmiTokenData[2 * i + 1],
                };
            }
            console.log(newUserTokenData);
            setUserTokens(newUserTokenData);
            setIsLoadingUserTokens(false);
        }
    }, [rawWagmiTokenData, userTokenIds]); // no need for userTokens

    const { config: mintRandomWordConfig } = usePrepareContractWrite({
        address: NORDLE_CONTRACT_ADDRESS,
        abi: [
            {
                inputs: [],
                name: 'requestCreateWord',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        overrides: { gasLimit: BigNumber.from(700_000) },
        functionName: 'requestCreateWord',
    });

    const { config: combineWordsConfig } = usePrepareContractWrite({
        address: NORDLE_CONTRACT_ADDRESS,
        abi: [
            {
                inputs: [
                    {
                        internalType: 'uint256[]',
                        name: '_tokensToCombine',
                        type: 'uint256[]',
                    },
                ],
                name: 'requestCombine',
                outputs: [
                    {
                        internalType: 'string',
                        name: 'newWord',
                        type: 'string',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        args: [selectedTokens.map(BigNumber.from)],
        overrides: { gasLimit: BigNumber.from(800_000) },
        functionName: 'requestCombine',
    });

    const { write: mintRandomWordWrite, data: mintRandomWordWriteData } =
        useContractWrite(mintRandomWordConfig);

    const { write: combineWordsWrite, data: combineWordsWriteData } =
        useContractWrite(combineWordsConfig);

    const handleMintRandomWord = useCallback(async () => {
        if (mintRandomWordWrite) mintRandomWordWrite();
    }, [mintRandomWordWrite]);

    const handleCombineWords = useCallback(async () => {
        if (combineWordsWrite && selectedTokens.length) combineWordsWrite();
    }, [combineWordsWrite, selectedTokens]);

    const {
        isLoading: isLoadingMintRandomWord,
        isSuccess: isSuccessMintRandomWord,
    } = useWaitForTransaction({
        hash: mintRandomWordWriteData?.hash,
    });

    const {
        isLoading: isLoadingCombineWords,
        isSuccess: isSuccessCombineWords,
    } = useWaitForTransaction({
        hash: combineWordsWriteData?.hash,
    });

    useEffect(() => {
        if (mintRandomWordWriteData?.hash)
            setMintTxHash(mintRandomWordWriteData.hash);
        else setMintTxHash('');
    }, [mintRandomWordWriteData]);

    useEffect(() => {
        if (combineWordsWriteData?.hash)
            setCombineTxHash(combineWordsWriteData.hash);
        else setCombineTxHash('');
    }, [combineWordsWriteData]);

    return (
        <NordleNFTContext.Provider
            value={{
                isLoadingUserTokens,
                userTokens,
                handleMintRandomWord,
                handleCombineWords,
                isLoadingMintRandomWord,
                isSuccessMintRandomWord,
                isLoadingCombineWords,
                isSuccessCombineWords,
                mintTxHash,
                combineTxHash,
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
