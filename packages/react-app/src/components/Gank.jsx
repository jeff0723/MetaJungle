import React from 'react'
import { Card, notification, Typography, Table, Button } from "antd";
const { Column, Space } = Table
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

function Gank() {
    const handleReport = (id) => {

    }
    return (
        <div>
            <Card style={styles.card} title={<Title level={2}>💰 Gank a Jungler</Title>}>
                <Table dataSource={dataSource}>
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
