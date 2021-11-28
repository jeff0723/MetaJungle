import React, { useEffect } from 'react';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import CURRENT_JUNGLER_STATE_ABI from '../events/CurrentJunglerState.json';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

interface Props {

}

const Ranking = (props: Props) => {
    const { Moralis, } = useMoralis();
    const { native } = useMoralisWeb3Api();
    const { walletAddress, chainId } = useMoralisDapp();
    useEffect(() => {
        const getEvent = async () => {
            const options = {
                chain: chainId,
                address: META_JUNGLE_ADDRESS[chainId],
                topic: "0xfa534782d33171b4fd6bad477513fbf21d9c8d47c60cd6cb4dd49ba52a6b5cb6",
                abi: CURRENT_JUNGLER_STATE_ABI
            }
            const response = await native.getContractEvents(options);
            console.log("event: ", response)
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
