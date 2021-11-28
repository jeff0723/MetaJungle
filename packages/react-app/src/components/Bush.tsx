
import React, { useEffect } from 'react';
import { useMoralis } from "react-moralis";
import { META_JUNGLE_ADDRESS } from '../constants/address';
import { openNotificationWithIcon } from '../helpers/notification';
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { MetaJungle__factory } from "../typechain";
interface Props {
    id: number
}

const Bush = ({ id }: Props) => {
    const { walletAddress, chainId, native } = useMoralisDapp();
    useEffect(() => {
        const getJunglerOnBush = async () => {
            if (chainId && walletAddress) {
                const options = {
                    chain: chainId,
                    address: META_JUNGLE_ADDRESS[chainId],
                    function_name: "getJunglerOnBush",
                    abi: MetaJungle__factory.abi,
                    params: { bushId: id.toString() }
                }
                const response = await native.runContractFunction(options);
                console.log(response);
            }
        }
    })
    const handleHideOnBush = (junglerId: number, bushId: number) => {

    }
    return (
        <div>

        </div>
    )
}

export default Bush
