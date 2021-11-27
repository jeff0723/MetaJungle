import React, { useEffect } from 'react';
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import CURRENT_JUNGLER_STATE_ABI from '../events/CurrentJunglerState.json';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { JUNGLE_RESOURCE, META_JUNGLE_ADDRESS } from '../constants/address';

interface Props {

}

const Ranking = (props: Props) => {
    const { Moralis, authenticate, isWeb3Enabled, web3, enableWeb3, isAuthenticated, } = useMoralis();
    const { account, native, token } = useMoralisWeb3Api();
    const { walletAddress, chainId } = useMoralisDapp();
    useEffect(() => {
        const getEvent = async () => {
            const options = {
                chain: chainId,
                address: META_JUNGLE_ADDRESS[chainId],
                topic: "0xff5c2b2eb99fd86cd5a2c44906926905cb82721b9b020f611d52765bf9382098",
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
