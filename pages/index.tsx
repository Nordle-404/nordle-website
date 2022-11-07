import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { UserNFTs } from '../pageElements/home/UserNFTs';
import { CombineNFTs } from '../pageElements/home/CombineNFTs';
import {
    NordleNFTContextProvider,
    useNordleNFTContext,
} from '../contexts/NordleNFTContext';

const Home: NextPage = () => {
    const { userTokens } = useNordleNFTContext();

    return (
        <div className="flex min-h-screen flex-col">
            <Head>
                <title>Nordle</title>
                <meta name="description" content="Nordle, a new NFT paradigm" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex-grow px-width-clamp py-20">
                <UserNFTs />
                <CombineNFTs />
            </main>
            <footer className="flex flex-row justify-end bg-off-black px-width-clamp pt-10 pb-5">
                <p className="text-xl text-off-white">⚡ Jongwon x Yuma 🦎</p>
            </footer>
        </div>
    );
};

export default Home;
