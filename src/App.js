import { useState, useEffect } from "react";
import myEpicNFT from "./utils/MyEpicNFT.json";
import ConnectWallet from "./components/ConnectWallet";
import MintNFT from "./components/MintNFT";
import "./App.css";
import { ethers } from "ethers";

function App() {
  // State Variables
  const [contractAddress] = useState(
    "0x9Bc328866020F8ED2AfD3B00c077052c7150877d"
  );
  const [contractAbi] = useState(myEpicNFT.abi);
  const [walletConnected, setWalletConnected] = useState();
  const [currentAccount, setCurrentAcount] = useState("");
  const [mining, setMining] = useState("");
  const [successfulMinting, setSuccessfulMinting] = useState(false);
  const [nftInfo, setNftInfo] = useState({ from: "", tokenId: "" });

  // Functions
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (ethereum) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false);
    }

    // Check if we have access to account
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAcount(account);
      setupEventListener();
    } else {
      setWalletConnected(false);
    }
  };

  // Sets up event listner for when a nft is minted
  const setupEventListener = () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setNftInfo({ from: from, tokenId: tokenId.toString() });
        });
      } else {
        setWalletConnected(false);
      }
    } catch (e) {
      console.log(`Tried to setup event listner but got "${e}"`);
    }
  };

  // useEffect to see if a wallet is connected
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="container">
      <ConnectWallet
        currentAccount={currentAccount}
        setCurrentAcount={setCurrentAcount}
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
      />
      <p>Each unique. Each beautiful. Discover your NFT today.</p>
      <p>You must be connected to the Sepolia testnet.</p>
      <MintNFT
        walletConnected={walletConnected}
        mining={mining}
        setMining={setMining}
        successfulMinting={successfulMinting}
        setSuccessfulMinting={setSuccessfulMinting}
        contractAddress={contractAddress}
        setupEventListener={setupEventListener}
        nftInfo={nftInfo}
        contractAbi={contractAbi}
      />
    </div>
  );
}

export default App;
