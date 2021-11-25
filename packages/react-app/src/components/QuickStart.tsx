import { Card, Divider, Typography } from "antd";
import React from 'react';
const { Title, Text } = Typography;

interface Props {

}
const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        maxWidth: '875px'
    },
};
const QuickStart = (props: Props) => {
    return (
        <div>
            <Card style={styles.card} title={<Title level={2}>📝 How To Play</Title>}>
                <Title level={3}>🐂 Breed a Bull</Title>
                <ul>
                    <li><Text>Deposit 1000 magic grass ($MGS) to start a position</Text></li>
                    <li><Text>Select a trading pair to open a posistion</Text></li>
                    <li><Text>Each position is a ERC-721 token, which presenting a bull that will grow up with your trading return</Text></li>
                    <li><Text>When there is a change of return, the metadata of your NFT will also change</Text></li>
                    <li><Text>You may also use leverage to increase your breeding speed</Text></li>
                </ul>
                <Divider />
                <Title level={3}>⚓ Report a bankrupt bull</Title>
                <ul>
                    <li><Text>You can report an bull if it is bankrupted</Text></li>
                    <li><Text>After the report success, reporter will be reward 100 magic grass</Text></li>
                </ul>
                <Divider />
                <Title level={3}>🏝️ Occupy a field</Title>
                <ul>
                    <li><Text>When you have a animal breed, you can occupy a field</Text></li>
                    <li><Text>You might be kicked out from your field if other stronger animal comes</Text></li>
                    <li><Text>There are only 100 fields</Text></li>
                </ul>
                <Divider />
                <Title level={3}>🌱 Generations</Title>
                <ul>
                    <li><Text>Each generation lasts 25 days</Text></li>
                    <li><Text>After the end of a generation, animals field will be reward 80% of value locked in this generation</Text></li>
                    <li><Text>10% of value locked will be giving to winner of proposal</Text></li>
                </ul>
                <Divider />
                <Title level={3}>📃 Proposals</Title>
                <ul>
                    <li><Text>Everyone can file a proposal for the animal skin of next generation</Text></li>
                    <li><Text>Any animal occupying a field and vote for the landlord to determine their future look</Text></li>
                    <li><Text>The end of generation reward can only be claimed through voting for a proposal</Text></li>
                </ul>
                <Divider />
            </Card>

        </div>
    )
}

export default QuickStart
