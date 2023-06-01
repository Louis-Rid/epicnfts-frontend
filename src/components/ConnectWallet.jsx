const ConnectWallet = ({
  walletConnected,
  currentAccount,
  setWalletConnected,
  setCurrentAcount,
  setupEventListner,
}) => {
  // Connects user's wallet to the site
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("You need to install metamask");
        setWalletConnected(false);
      }

      // Request access to account
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAcount(accounts[0]);
      setWalletConnected(true);
      setupEventListner();
    } catch (e) {
      console.log(`Tried to connect wallet but got ${e}`);
    }
  };
  return (
    <div>
      {walletConnected ? (
        <h1>Hello {currentAccount.substring(0, 7)}...</h1>
      ) : (
        <div>
          <h1>You need to connect your wallet</h1>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
