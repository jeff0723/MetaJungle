import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { notification, Typography, Modal, Input, Select, Button } from "antd";
import { resolveIPFSLink } from '../helpers/formatters'
import pricePairs from '../constants/pricePairs'
import { useMoralis, useWeb3Contract } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
import { utils } from 'ethers'
const { Text } = Typography
const { Option } = Select;

interface JunglerProfile {
    id: number
    generation: number
    isOpen: boolean
    isCamping: boolean
    power: number
    proxy: string
    openPrice: number
    leverage: number
    tokenURI: string
}

interface Props {
    junglerProfile: JunglerProfile
}

const StyledCard = styled('div')`
    width:198px;
    height:264px;
    border-radius:1rem;
    border: 1px solid #e7eaf3;
    display:flex;
    flex-direction:column;
    :hover{
        cursor: pointer;
        border: 2px solid #1890ff;
        .img{
            width:196px;
             height:196px
        }
    }
`
const FlexRow = styled('div')`
    display:flex;
    flex-direction:row;
`
const FlexColumn = styled('div')`
    display:flex;
    flex-direction:column;
`

const BoldText = styled(Text)`
    font-size:16px;
    font-weight: 700;
    line-height: 150%;

`
const fetchMetaData = async (tokenURI: string) => {
    const metaData = await fetch(tokenURI)
        .then(response => response.json())
        .then(data => resolveIPFSLink(data.image))
    return metaData;
}

const openNotificationWithIcon = (type: string, message: string, description: string) => {
    switch (type) {
        case "warning":
            notification['warning']({
                message: message,
                description: description,
            });
            break;
        case "success":
            notification['success']({
                message: message,
                description: description,
            });
    }
};
const JunglerCard = ({ junglerProfile }: Props) => {
    const { web3, Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [imageURL, setImageURL] = useState<string>()
    const [isDashBoardOpen, setIsDashBoardOpen] = useState(false);
    const [pair, setPair] = useState<string>();
    const [leverage, setLeverage] = useState<string>();
    useEffect(() => {
        const _setImageURL = async () => {
            setImageURL(await fetchMetaData(junglerProfile.tokenURI));

        }
        _setImageURL();
    })

    const handleCreate = () => {
        if (!leverage || !pair) {
            openNotificationWithIcon("warning", "Input not complete!", "Please compelete required input field.")
            return
        }
        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'open',
                abi: MetaJungle__factory.abi,
                params: {
                    junglerId: junglerProfile.id,
                    namehash: utils.namehash(pair),
                    leverage: leverage
                }
            };
            console.log('execute: ');
            Moralis.Web3.executeFunction(options).then(() => {
                openNotificationWithIcon("success", "Open position success", 'Succesffully open a position.');
            })
        }

    }

    return (
        <>
            <StyledCard onClick={() => { setIsDashBoardOpen(true) }}>
                <img src={imageURL} style={{ borderRadius: '1rem' }} alt='jungleCard' />
                <div style={{ padding: '8px 16px' }}>
                    <Text>ID: {junglerProfile.id}</Text><br />
                    <Text>Power: {junglerProfile.power / 1000}</Text><br />
                </div>
            </StyledCard>
            <Modal
                visible={isDashBoardOpen}
                footer={null}
                onCancel={() => setIsDashBoardOpen(false)}>
                <FlexColumn>
                    <FlexRow style={{ gap: '32px' }}>
                        <div>
                            <img src={imageURL} width="198px" height='198px' style={{ borderRadius: '1rem' }} alt='jungleCard' />
                        </div>
                        <FlexColumn style={{ justifyContent: 'space-between' }}>
                            <BoldText>Generation: {junglerProfile.generation}</BoldText>
                            <BoldText>ID: {junglerProfile.id}</BoldText>
                            <BoldText >Power: {junglerProfile.power / 1000}</BoldText>
                            <BoldText >Position: {junglerProfile.isOpen ? "Open" : "Closed"}</BoldText>

                        </FlexColumn>
                    </FlexRow>
                    <FlexColumn style={{ padding: '16px', gap: '16px', border: '1px solid #e7eaf3', marginTop: '32px', borderRadius: '16px' }}>
                        <Text>Open postion</Text>
                        <Select placeholder="Select your trading pair" value={pair} onChange={(value) => { setPair(value) }}>
                            {Object.keys(pricePairs).map((key, index) => (
                                <Option value={pricePairs[key]}>{key}</Option>
                            ))}
                        </Select>
                        <Input placeholder="Set your leverage" value={leverage} onChange={(e) => { setLeverage(e.target.value) }} />
                        <Text style={{ fontSize: '12px', fontStyle: 'italic' }}>*note: leverage can only between -128 ~ 127</Text>
                        <Button style={{ borderRadius: '16px', background: '#1890ff', color: '#ffffff' }} onClick={handleCreate}>Open</Button>
                    </FlexColumn>
                </FlexColumn>
            </Modal>
        </>
    )
}

export default JunglerCard
