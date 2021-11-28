import React, { useEffect, useState } from 'react'
import { Card, List, Typography, Avatar, Button, Form, Input, } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { MetaJungle__factory } from "../typechain";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { utils } from 'ethers'
import { openNotificationWithIcon } from '../helpers/notification'
import { resolveIPFSLink, getEllipsisTxt } from '../helpers/formatters'
import { UserOutlined } from '@ant-design/icons';
const { Title } = Typography

interface Props {

}
interface ProposalData {
    proposer: string
    baseURI: string
    bid: number
    voteCount: number
}
const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
    },
}

const mapArrayToProposal = (array: any): ProposalData => {
    return {
        proposer: array[0],
        baseURI: array[1],
        bid: array[2],
        voteCount: array[3]
    }
}
const Vote = (props: Props) => {
    const { Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();
    const [proposalList, setProposalList] = useState<ProposalData[]>();
    useEffect(() => {
        const getAllProposals = async () => {
            if (chainId && walletAddress) {
                const options = {
                    chain: chainId,
                    address: META_JUNGLE_ADDRESS[chainId],
                    function_name: 'getAllProposals',
                    abi: MetaJungle__factory.abi,
                };
                let response = (await Moralis.Web3API.native.runContractFunction(options).then(response => response)) as Array<[]>;
                setProposalList(response.map((item) => mapArrayToProposal(item)));
            }
        }
        getAllProposals();

    })
    const handleVote = (id: number) => {
        // if(chainId)
    }
    return (
        <div>
            <Card style={{ ...styles.card, minWidth: '375px', width: '50vw', maxWidth: '875px' }} title={<Title level={2}>💰 Vote for a Proposal</Title>}>
                <List
                    dataSource={proposalList}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={`Proposal #${index}`}
                                description={getEllipsisTxt(item.proposer)}
                            />
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                                <span>{utils.formatEther(item.bid.toString())} ETH</span>
                                <span>{parseInt(utils.formatEther(item.voteCount.toString()))} Vote(s)</span>
                                <a href={resolveIPFSLink(item.baseURI)} target="_blank" rel="noreferrer">View Proposal</a>
                                <Button type="primary" style={{ borderRadius: '16px' }} onClick={() => { handleVote(index) }}>Vote</Button>
                            </div>
                        </List.Item>
                    )}
                >

                </List>
            </Card>
        </div>
    )
}

export default Vote
