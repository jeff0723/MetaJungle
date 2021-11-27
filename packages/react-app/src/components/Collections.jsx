import { PlusOutlined } from "@ant-design/icons";
import { Card, Skeleton, Typography, notification, message } from "antd";
import React, { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract, useApiContract, useMoralisWeb3Api } from "react-moralis";
import styled from 'styled-components';
import { Bullosseum__factory, BullosseumAmissionFee__factory as BAF_factory } from "../typechain";
import { BULLOSSEUM_ADDRESS, BAF_ADDRESS } from '../constants/address';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { ethers } from "ethers";

const { Text, Title } = Typography
const AddCard = styled('div')`
    border: 2px dashed #e7eaf3;
    border-radius: 1rem;
    width: 198px;
    height: 264px;
    border-spacing: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dfe1e6 ;
    :hover {
                cursor: pointer;
                border: 2px dashed #1890ff;
                color: #1890ff;
            };
`

const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        maxWidth: '960px',
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    addCard: {
        border: '2px dashed #e7eaf3',
        borderRadius: '1rem',
        width: '198px',
        height: '264px',
        borderSpacing: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        "&:hover": {
            cursor: "pointer",
            background: "rgba(255,255,255,0.3)"
        }
    },
    gameCard: {
        borderRadius: '1rem',
        width: '198px',
        height: '264px',
    }
}

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description,
    });
};
const Collections = () => {
    const { Moralis, authenticate, isWeb3Enabled, web3, enableWeb3, isAuthenticated } = useMoralis();
    const { account, native, token } = useMoralisWeb3Api();
    const { walletAddress, chainId } = useMoralisDapp();
    const [bullosseumAddress, setBullosseumAddress] = useState("");
    const [bafAddress, setBafAddress] = useState("")
    const [bullContract, setBullContract] = useState();
    const [bafContract, setBafContract] = useState();
    const [allowance, setAllowance] = useState();
    const [bullContractNFTs, setBullContractNFTs] = useState();

    useEffect(() => {
        const getAllowance = async () => {
            const options = {
                chain: chainId,
                owner_address: walletAddress,
                spender_address: bullosseumAddress,
                address: bafAddress
            };
            console.log('get allowance:')
            const { allowance } = await token.getTokenAllowance(options).then(result => (result));
            setAllowance(allowance);
            console.log("allowance:", allowance)
        }
        const fetchNFT = async () => {
            const options = {
                chain: chainId,
                token_address: bullosseumAddress,
                address: walletAddress
            }
            console.log('owner: ', walletAddress)
            console.log("bullosseumAddress: ", '0xa3206Ff17ACb969e7AA1d0F7c092AD940A85e20A')
            const bullContractNFTs = await account.getNFTsForContract(options)
            console.log("bullContractNFTs: ", bullContractNFTs);
            setBullContractNFTs(bullContractNFTs);
        }
        if (chainId && !bullosseumAddress && !bafAddress) {
            setBullosseumAddress(BULLOSSEUM_ADDRESS[chainId]);
            setBafAddress(BAF_ADDRESS[chainId]);
        }
        if (walletAddress && !isWeb3Enabled) {
            enableWeb3();
        }
        if (bafAddress && walletAddress && chainId) {
            getAllowance()
        }
        if (walletAddress && chainId && bullosseumAddress) {
            console.log("start to fetch")
            fetchNFT();
        }
        if (!isWeb3Enabled) {
            enableWeb3();
        }
        if (web3 && !bullContract && !bafContract) {
            setBullContract(new web3.eth.Contract(Bullosseum__factory.abi, bullosseumAddress));
            setBafContract(new web3.eth.Contract(BAF_factory.abi, bafAddress));

        }

    }, [chainId, walletAddress, bullosseumAddress, bafAddress, bullContract, bafContract])

    const handleCreateBreed = async () => {
        if (!walletAddress) {
            openNotificationWithIcon("warning", "Wallet Connect Warning", 'You need to connect to wallet to perform this action.');
            return;
        }
        if (!bullosseumAddress || !web3 || !isWeb3Enabled || !bullContract || !bafContract) return;

        const contract = new web3.eth.Contract(BAF_factory.abi, bafAddress, { gas: 1000000, gasPrice: "2000000000" })
        if (!allowance) {
            let receipt = await contract.methods
                .approve(bullosseumAddress, ethers.constants.MaxUint256)
                .send({ from: walletAddress })
                .then((response) => {
                    openNotificationWithIcon("success", "Approval success", 'Succesffully approve smart contract to use your token!');
                    setAllowance(ethers.constants.MaxUint256);
                })
        }
        else {
            let receipt = await bullContract.methods
                .breed()
                .send({ from: walletAddress })
                .then((response) => {
                    console.log(response)
                    return response;
                })
        }
    }
    console.log("walletAddress: ", walletAddress)
    console.log("chainId: ", chainId)
    console.log("bullosseumAddress: ", bullosseumAddress)
    console.log("bullosseumAddress: ", bafAddress)
    console.log('isWeb3Enabled: ', isWeb3Enabled);
    console.log("isAuthenticated: ", isAuthenticated);
    console.log("bullContract", bullContract);
    console.log("bafContract", bafContract);
    console.log("web3", web3);
    console.log("bullContractNFT", bullContractNFTs);
    return (
        <div>
            <Card style={styles.card} title={<Title level={2}>💰 Inventory</Title>}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '16px'
                }}>
                    <AddCard onClick={handleCreateBreed}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            padding: '16px',
                        }}>
                            <PlusOutlined style={{ fontSize: '24px' }} />
                            <Text style={{ fontSize: '21px', fontWeight: 'bold', marginTop: '10px' }}>Breed your first bull!</Text>
                            <Text>This is the first step to collecting and breeding bulls</Text>
                        </div>
                    </AddCard>
                    <Skeleton.Input style={styles.gameCard} />
                    <Skeleton.Input style={styles.gameCard} />
                    <Skeleton.Input style={styles.gameCard} />

                </div>
            </Card >
        </div >
    )
}

export default Collections
