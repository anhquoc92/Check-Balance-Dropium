import React from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { loadContract } from "./loadContract";
import Web3 from "web3";

//Goerli token test
const BUSD_TOKEN_ADDRESS = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const THG_TOKEN_ADDRESS = "0x9fd87aefe02441b123c3c32466cd9db4c578618f";
const THC_TOKEN_ADDRESS = "0x24802247bd157d771b7effa205237d8e9269ba8a";
const ERC20ABI = require("./abi_bsc_chain.json");

export default function BalanceTokenGoerli() {
  const [walletAddress, setWalletAdress] = useState(0);
  const [ether, setEther] = useState(0);
  const [busd, setBusd] = useState(0);
  const [thg, setThg] = useState(0);
  const [thc, setThc] = useState(0);

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);

      provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      let ether;
      ether = await signer.getBalance();
      ether = parseFloat(ethers.utils.formatEther(ether, 18));
      setEther(ether);

      const walletAddress = await signer.getAddress();
      setWalletAdress(walletAddress);

      //creat web3
      const { ethereum } = window;
      window.web3 = new Web3(ethereum);
      await ethereum.enable();
      window.web3 = new Web3(window.web3.currentProvider);
      const web3 = window.web3;

      // Balance BUSD
      const contractBusdAddress =
        web3.utils.toChecksumAddress(BUSD_TOKEN_ADDRESS);
      const contractBusd = await loadContract(ERC20ABI, contractBusdAddress);
      const balanceBusd = await contractBusd.methods
        .balanceOf(walletAddress)
        .call();
      console.log("balanceBusd_web3");
      console.log(web3.utils.fromWei(balanceBusd.toString()));

      // Balance BUSD-2
      let busd;
      const busdTokenContract = await new ethers.Contract(
        BUSD_TOKEN_ADDRESS,
        ERC20ABI,
        provider
      );
      busd = await busdTokenContract.balanceOf(walletAddress);
      console.log("balanceBusd_ethers");
      console.log(ethers.utils.formatEther(busd, 18));
      busd = parseFloat(ethers.utils.formatEther(busd, 18));
      setBusd(busd);

      //Balance THG
      const contractThgAddress =
        web3.utils.toChecksumAddress(THG_TOKEN_ADDRESS);
      const contractThg = await loadContract(ERC20ABI, contractThgAddress);
      const balanceThg = await contractThg.methods
        .balanceOf(walletAddress)
        .call();
      console.log("balanceLink_web3");
      console.log(web3.utils.fromWei(balanceThg.toString()));

      //Balance THG-2
      let thg;
      const thgTokenContract = await new ethers.Contract(
        THG_TOKEN_ADDRESS,
        ERC20ABI,
        provider
      );
      thg = await thgTokenContract.balanceOf(walletAddress);
      thg = parseFloat(ethers.utils.formatEther(thg, 18));
      setThg(thg);

      //Balance THC
      const contractThcAddress =
        web3.utils.toChecksumAddress(THC_TOKEN_ADDRESS);
      const contractThc = await loadContract(ERC20ABI, contractThcAddress);
      const balanceThc = await contractThc.methods
        .balanceOf(walletAddress)
        .call();
      console.log("balanceThc_web3");
      console.log(web3.utils.fromWei(balanceThc.toString()));

      //Balance THC_2
      let thc;
      const thcTokenContract = await new ethers.Contract(
        THC_TOKEN_ADDRESS,
        ERC20ABI,
        provider
      );
      thc = await thcTokenContract.balanceOf(walletAddress);
      thc = parseFloat(ethers.utils.formatEther(thc, 18));
      setThc(thc);
      console.log("balanceWeth_ethers");
      console.log(thc);
    };

    onLoad();
  }, []);

  return (
    <div>
      <h3>Welcome to wallet: {walletAddress}</h3>
      <h3>BNB: {ether.toFixed(4)}</h3>
      <h3>BUSD: {busd.toFixed(4)}</h3>
      <h3>THG: {thg.toFixed(4)}</h3>
      <h3>THC: {thc.toFixed(4)}</h3>
    </div>
  );
}
