import Web3 from "web3";

const loadContract = async (contractABI, contractAddress) => {
  //creat web3
  const { ethereum } = window;
  window.web3 = new Web3(ethereum);
  await ethereum.enable();
  window.web3 = new Web3(window.web3.currentProvider);
  const web3 = window.web3;
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  return contract;
};

export { loadContract };
