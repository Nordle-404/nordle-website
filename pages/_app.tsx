import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
    getDefaultWallets,
    Theme,
    darkTheme,
    Chain,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { BasicNavbar } from '../components/Navbars/BasicNavbar';
import { MediaQueryContextProvider } from '../contexts/MediaQueryContext';

const { chains, provider } = configureChains(
    [chain.mainnet, chain.goerli],
    [
        alchemyProvider({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
        }),
        publicProvider(),
    ]
);

const { wallets } = getDefaultWallets({
    appName: 'RainbowKit App',
    chains,
});

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [
            argentWallet({ chains }),
            trustWallet({ chains }),
            ledgerWallet({ chains }),
        ],
    },
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <MediaQueryContextProvider>
                    <BasicNavbar />
                    <Component {...pageProps} />
                </MediaQueryContextProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
