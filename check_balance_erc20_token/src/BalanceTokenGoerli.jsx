import React from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { loadContract } from "./loadContract";
import Web3 from "web3";

//Goerli token test
const UNI_TOKEN_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const LINK_TOKEN_ADDRESS = "0x326c977e6efc84e512bb9c30f76e30c160ed06fb";
const WETH_TOKEN_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const ERC20ABI = require("./abi.json");

export default function BalanceTokenGoerli() {
  const [walletAddress, setWalletAdress] = useState(0);
  const [ether, setEther] = useState(0);
  const [uni, setUni] = useState(0);
  const [link, setLink] = useState(0);
  const [weth, setWeth] = useState(0);

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);

      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      let ether;
      ether = await signer.getBalance();
      ether = ethers.utils.formatEther(ether, 18);
      setEther(ether);

      const walletAddress = await signer.getAddress();
      setWalletAdress(walletAddress);

      //creat web3
      const { ethereum } = window;
      window.web3 = new Web3(ethereum);
      await ethereum.enable();
      window.web3 = new Web3(window.web3.currentProvider);
      const web3 = window.web3;

      // Balance UNI
      const contractUniAddress =
        web3.utils.toChecksumAddress(UNI_TOKEN_ADDRESS);
      const contractUni = await loadContract(ERC20ABI, contractUniAddress);
      const balanceUni = await contractUni.methods
        .balanceOf(walletAddress)
        .call();
      console.log("balanceUni_web3");
      console.log(web3.utils.fromWei(balanceUni.toString()));

      // Balance UNI-2
      let uni;
      const uniTokenContract = await new ethers.Contract(
        UNI_TOKEN_ADDRESS,
        ERC20ABI,
        provider
      );
      uni = await uniTokenContract.balanceOf(walletAddress);
      console.log("balanceUni_ethers");
      console.log(ethers.utils.formatEther(uni, 18));
      uni = ethers.utils.formatEther(uni, 18);
      setUni(uni);

      //Balance LINK
      const contractLinkAddress =
        web3.utils.toChecksumAddress(LINK_TOKEN_ADDRESS);
      const contractLink = await loadContract(ERC20ABI, contractLinkAddress);
      const balanceLink = await contractLink.methods
        .balanceOf(walletAddress)
        .call();
      console.log("balanceLink_web3");
      console.log(web3.utils.fromWei(balanceLink.toString()));

      //Balance LINK-2
      let link;
      const linkTokenContract = await new ethers.Contract(
        LINK_TOKEN_ADDRESS,
        ERC20ABI,
        provider
      );
      link = await linkTokenContract.balanceOf(walletAddress);
      link = ethers.utils.formatEther(link, 18);
      setLink(link);

      //Balance WETH
      const contractWethAddress =
        web3.utils.toChecksumAddress(WETH_TOKEN_ADDRESS);
      const contractWeth = await loadContract(ERC20ABI, contractWethAddress);
      const balanceWeth = await contractWeth.methods
        .balanceOf(walletAddress)
        .call();
      console.log("balanceWeth_web3");
      console.log(web3.utils.fromWei(balanceWeth.toString()));

      //Balance WETH_2
      let weth;
      const wethTokenContract = await new ethers.Contract(
        WETH_TOKEN_ADDRESS,
        ERC20ABI,
        provider
      );
      weth = await wethTokenContract.balanceOf(walletAddress);
      weth = ethers.utils.formatEther(weth, 18);
      setWeth(weth);
      console.log("balanceWeth_ethers");
      console.log(weth);
    };

    onLoad();
  }, []);

  return (
    <div>
      <h3>Welcome to wallet: {walletAddress}</h3>
      <h3>Goeri ETH: {ether}</h3>
      <h3>UNI: {uni}</h3>
      <h3>LINK: {link}</h3>
      <h3>WETH: {weth}</h3>
    </div>
  );
}
