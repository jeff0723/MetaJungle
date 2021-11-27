import React from 'react'
import { useNFTBalances } from 'react-moralis'
interface Props {

}

const Test = (props: Props) => {
    const { data } = useNFTBalances();
    console.log("data:", data);
    return (
        <div>

        </div>
    )
}

export default Test
