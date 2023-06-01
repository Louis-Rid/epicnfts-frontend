import { ProgressBar } from "react-loader-spinner";
import { ethers } from "ethers";

const MintNFT = ({
  walletConnected,
  mining,
  setMining,
  setSuccessfulMinting,
  successfulMinting,
  contractAddress,
  contractAbi,
  nftInfo,
}) => {
  // State Variables
  let connectedContract;

  // Functions
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        connectedContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        let nftTxn = await connectedContract.makeAnEpicNFT();
        setSuccessfulMinting(false);
        setMining(true);
        console.log("mining...");
        await nftTxn.wait();
        setMining(false);
        setSuccessfulMinting(true);
        console.log("mined");
      } else {
        alert("Ethereum object does not exist.");
      }
    } catch (e) {
      console.log(
        `Tried to ask contract to mint nft but got "${e}" ${contractAbi}------- ${contractAddress}`
      );
    }
  };

  return (
    <div>
      {walletConnected ? (
        <button
          onClick={askContractToMintNft}
          className={mining ? "mining" : ""}
        >
          {mining ? (
            <ProgressBar
              height="80"
              width="80"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass="progress-bar-wrapper"
              borderColor="#345511"
              barColor="#DCFFFD"
            />
          ) : (
            "Mint NFT"
          )}
        </button>
      ) : (
        ""
      )}
      {successfulMinting ? (
        <div>
          <h2>Congrats! You have a new minted NFT!</h2>
          <p>Here is the address of the contract: {contractAddress}</p>
          <p>and here is the token ID: {nftInfo.tokenId}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MintNFT;
