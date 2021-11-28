import React, { useEffect } from 'react';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import CURRENT_JUNGLER_STATE_ABI from '../events/CurrentJunglerState.json';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

const getOpen = async (responseArray) => {
    const openMap = new Map();
    const closeMap = new Map();

    for (let i = 0; i < responseArray.length; i++) {
        const data = responseArray[i].data;
        console.log("data: ", data);
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

const Ranking = (props) => {
    const { Moralis, } = useMoralis();
    const { native } = useMoralisWeb3Api();
    const { walletAddress, chainId } = useMoralisDapp();

    let openMap = new Map();
    let closeMap = new Map();

    useEffect(() => {
        const getEvent = async () => {
            const options = {
                chain: chainId,
                address: META_JUNGLE_ADDRESS[chainId],
                topic: "0xfa534782d33171b4fd6bad477513fbf21d9c8d47c60cd6cb4dd49ba52a6b5cb6",
                abi: CURRENT_JUNGLER_STATE_ABI
            }
            const response = (await native.getContractEvents(options));
            console.log("response: ", response.result);
            const openMap = await getOpen(response.result);
            console.log("openMap: ", openMap);

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
    return (
        <div>

        </div>
    )
}

export default Ranking
