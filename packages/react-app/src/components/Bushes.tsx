import { Button, Input, Modal, notification, Select, Typography, Card } from "antd";
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useMoralis } from "react-moralis";
import styled from 'styled-components';
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { pricePairs } from '../constants/pricePairs';
import { resolveIPFSLink } from '../helpers/formatters';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
import { proxyToPairs } from '../constants/proxyToPairs'
import { LoadingOutlined } from '@ant-design/icons';
import { openNotificationWithIcon } from '../helpers/notification'
interface Props {

}

const Bushes = (props: Props) => {
    const { Moralis } = useMoralis();
    const { walletAddress, chainId } = useMoralisDapp();

    const handleHideOnBush = (junglerId: number, bushId: number) => {
        if (chainId && walletAddress) {
            const options = {
                contractAddress: META_JUNGLE_ADDRESS[chainId],
                functionName: 'camp',
                abi: MetaJungle__factory.abi,
                params: {
                    junglerId: junglerId,
                    bushId: bushId
                }
            };
            Moralis.Web3.executeFunction(options).then(async () => {
                openNotificationWithIcon("success", "Open position success", 'Succesffully open a position.');
                // setProfile(mapProfileArrayToObject((await getJungler())));
            })
        }
    }
    return (
        <div>
            <Card>
                <Button type='primary' onClick={() => { handleHideOnBush(1, 1) }}>hide on bush</Button>
            </Card>
        </div>
    )
}

export default Bushes
