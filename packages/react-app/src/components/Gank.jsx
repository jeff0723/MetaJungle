import { Button, Card, Table, Typography, notification } from "antd";
import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { proxyToPairs } from '../constants/proxyToPairs';
import CURRENT_JUNGLER_STATE_ABI from '../events/CurrentJunglerState.json';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { JungleResource__factory as JGR_factory, MetaJungle__factory } from "../typechain";
import { ethers } from "ethers";


const getOpen = async (responseArray) => {
    const openMap = new Map();
    const closeMap = new Map();

    for (let i = 0; i < responseArray.length; i++) {
        const data = responseArray[i].data;
        // console.log("data: ", data);
        const uid = data.uid;
        const isOpen = data.data[1];
        if (isOpen) {
            if (closeMap.has(uid)) {
                continue;
            } else {
                openMap.set(uid, data.data);
            }
        } else {
            closeMap.set(uid, "close");
        }
    }
    return openMap;
}

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message: message,
        description: description,
    });
};

const { Column } = Table
const { Title } = Typography
const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
    },
}

const dataSource = [
    {
        id: 1,
        power: 1000,
        proxy: 'ETH/USD',
        openPrice: 1000,
        leverage: 1
    },
    {
        id: 2,
        power: 1200,
        proxy: 'ETH/USD',
        openPrice: 1200,
        leverage: 2
    },
];


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Power',
        dataIndex: 'power',
        key: 'power',
    },
    {
        title: 'Trading Pair',
        dataIndex: 'proxy',
        key: 'proxy',
    },
    {
        title: 'Open Price',
        dataIndex: 'openPrice',
        key: 'openPrice',
    },
    {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
    },
];

let source = [];

function Gank() {
    const { Moralis } = useMoralis();
    const { native, token } = useMoralisWeb3Api();
    const { walletAddress, chainId } = useMoralisDapp();
    const [openList, setOpenList] = useState([]);

    useEffect(() => {
        const getEvent = async () => {
            const options = {
                chain: chainId,
                address: META_JUNGLE_ADDRESS[chainId],
                topic: "0xfa534782d33171b4fd6bad477513fbf21d9c8d47c60cd6cb4dd49ba52a6b5cb6",
                abi: CURRENT_JUNGLER_STATE_ABI
            }
            const response = (await native.getContractEvents(options));
            // console.log("response: ", response.result);
            const temp = []
            const openMap = await getOpen(response.result);
            console.log("openMap: ", openMap);
            openMap.forEach((value, key) => {
                console.log("value: ", value);
                temp.push({
                    id: parseInt(key, 10),
                    power: parseInt(value[3], 10) / 1000,
                    proxy: proxyToPairs[value[4]],
                    openPrice: parseInt(value[5], 10) / 1000000,
                    leverage: parseInt(value[6], 10) / 10
                });
            });
            setOpenList(temp);
            console.log("source: ", source);
            console.log("DataSource: ", temp);

        }
        const QueryEvent = async () => {
            const Status = Moralis.Object.extend("status");
            const query = new Moralis.Query(Status);
        }
        if (chainId && walletAddress) {
            getEvent();
        }
        QueryEvent();

    })



    const handleReport = (id) => {

        const options = {
            contractAddress: META_JUNGLE_ADDRESS[chainId],
            functionName: 'gank',
            abi: MetaJungle__factory.abi,
            params: {
                junglerId: id,
            }
        };
        Moralis.Web3.executeFunction(options).then(async () => {
            openNotificationWithIcon("success", "gank {id} success", 'Succesffully gank {id}');
            // setProfile(mapProfileArrayToObject((await getJungler())));
        })
    }
    console.log("openList:", openList)
    return (
        <div>
            <Card style={styles.card} title={<Title level={2}>💰 Gank a Jungler</Title>}>
                <Table dataSource={openList}>
                    <Column title="ID" dataIndex="id" key="id" />
                    <Column title="Power" dataIndex="power" key="power" />
                    <Column title="Trading Pair" dataIndex="proxy" key="proxy" />
                    <Column title="Open Price" dataIndex="openPrice" key="openPrice" />
                    <Column title="Leverage" dataIndex="leverage" key="leverage" />
                    <Column
                        title='Action'
                        key='report'
                        render={(text, record) => (
                            <Button type="primary" style={{ borderRadius: '16px' }} onClick={() => { handleReport(record.id) }} >Gank</Button>
                        )} />
                </Table>

            </Card>
        </div>
    )
}

export default Gank
