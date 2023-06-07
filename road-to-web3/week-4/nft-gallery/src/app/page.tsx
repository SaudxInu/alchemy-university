"use client";

import { useState } from 'react';
import { NFTCard } from "../../components/nftCard";

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection]=useState(false)


  const fetchNFTs = async() => {
    const api_key = "ALCHEMY_ETH_MAINNET_API_KEY"
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;

    console.log("Fetching NFTs...");

    let nfts;

    var requestOptions = {
        method: 'GET'
    };

    if (!wallet.length) {
      console.log("Please enter a wallet address.");
      
      return;
    }
      
    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("NFTs:", nfts)

      setNFTs(nfts.ownedNfts)
    }
  }


  const fetchNFTsForCollection = async () => {
    const api_key = "ALCHEMY_ETH_MAINNET_API_KEY"
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;

    console.log("Fetching NFTs...");

    let nfts;

    var requestOptions = {
      method: 'GET'
    };

    if (collection.length) {
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (nfts) {
        console.log("NFTs:", nfts)

        setNFTs(nfts.nfts)
      }
    }
  }

  
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        
        <input onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        
        <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }
        }>Let's go!</button>
      </div>

      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}


export default Home


// 0x242559CceEce552cC790bd3F2f9D890921ed6125
// 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
