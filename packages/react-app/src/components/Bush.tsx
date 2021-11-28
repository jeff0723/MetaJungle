
import React, { useEffect, useState } from 'react';
import { useMoralis } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { openNotificationWithIcon } from '../helpers/notification';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
import { Card, Input, Typography, Button } from "antd";

const { Title, Text } = Typography
interface Props {
    id: number
    image: string | undefined
}

interface JunglerData {
    generation: number
    isOpen: boolean
    isCampping: boolean
    power: number
    proxy: string
    openPrice: number
    leverage: number
}
const Bush = ({ id, image }: Props) => {
    const { Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [junglerProfile, setJunglerProfile] = useState<JunglerData>();
    const [campJunglerId, setCampJunglerId] = useState("");

    useEffect(() => {
        const getJunglerOnBush = async () => {
            const options = {
                chain: chainId,
                address: META_JUNGLE_ADDRESS[chainId],
                function_name: "getJunglerOnBush",
                abi: MetaJungle__factory.abi,
                params: { bushId: id }
            }
            const response = await Moralis.Web3API.native.runContractFunction(options).catch(err => 0);
            if (response) {
                console.log("junger on bush: ", response);
            }

        }
        if (chainId && walletAddress) {
            getJunglerOnBush();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, walletAddress])
    const handleCamp = () => {
        if (!campJunglerId || isNaN(parseInt(campJunglerId))) {
            openNotificationWithIcon('error', 'Input Error!', 'You need to enter number or enter number of Jungler ID you want to camp.')
        }
        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'camp',
                abi: MetaJungle__factory.abi,
                params: {
                    junglerId: campJunglerId,
                    bushId: id.toString()
                }
            }
            Moralis.Web3.executeFunction(options).then(async () => {
                openNotificationWithIcon("success", "Camp success", 'Succesffully camped on a bush.');
                setCampJunglerId("");
            })
        }
    }
    console.log("Jungler profile: ", junglerProfile);
    return (
        <div>
            {
                junglerProfile ?
                    <></> :
                    <>
                        <Title level={5}>There is no Jungler on this bush!</Title>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={image} alt='bush' width="350px" height="350px" />
                        </div>
                        <Text>Choose Jungler You Want to Camp on:</Text>
                        <Input placeholder='Jungler ID ex:1' style={{ marginBottom: '32px', borderRadius: '12px' }} value={campJunglerId} onChange={(e) => { setCampJunglerId(e.target.value) }} />
                        <Button type="primary" style={{ width: '100%', borderRadius: '16px' }} onClick={handleCamp}>Camp</Button>
                    </>
            }
        </div>
    )
}

export default Bush
