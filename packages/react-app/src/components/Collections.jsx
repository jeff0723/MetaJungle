import { PlusOutlined } from "@ant-design/icons";
import { Card, Skeleton, Typography } from "antd";
import React, { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from "react-moralis";
import styled from 'styled-components';
import { Bullosseum__factory } from "../typechain";
import { BULLOSSEUM_ADDRESS } from '../constants/address';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

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


const Collections = () => {
    const { Moralis, authenticate } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [contractAddress, setContractAddress] = useState("");
    const { runContractFunction } = useWeb3Contract({
        abi: Bullosseum__factory.abi,
        contractAddress: contractAddress,
        functionName: "breed",
    });
    useEffect(() => {
        if (chainId) {
            setContractAddress(BULLOSSEUM_ADDRESS[chainId]);
        }
    }, [chainId])
    const handleCreateBreed = async () => {
        if (!contractAddress) return;
        if (!walletAddress) {
            authenticate();
        }
        runContractFunction();
    }
    // tx.on("transactionHash", (hash) => {
    //     openNotification({
    //       message: "🔊 New Transaction",
    //       description: `${hash}`,
    //     });
    //     console.log("🔊 New Transaction", hash);
    //   })
    //     .on("receipt", (receipt) => {
    //       openNotification({
    //         message: "📃 New Receipt",
    //         description: `${receipt.transactionHash}`,
    //       });
    //       console.log("🔊 New Receipt: ", receipt);
    //     })
    //     .on("error", (error) => {
    //       console.log(error);
    //     });
    // }
    console.log("walletAddress: ", walletAddress)
    console.log("chainId: ", chainId)
    console.log("contractAddress: ", contractAddress)
    console.log('web3: ', Moralis.Web3);
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
