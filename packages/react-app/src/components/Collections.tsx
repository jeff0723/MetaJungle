import React from 'react'
import { Card, Skeleton, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {

}
const { Text, Title } = Typography
const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        maxWidth: '960px',
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    addCard: {
        border: '2px dashed #e7eaf3',
        borderRadius: '1rem',
        width: '198px',
        height: '264px',
        borderSpacing: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gameCard: {
        borderRadius: '1rem',
        width: '198px',
        height: '264px',
    }
}

const Collections = (props: Props) => {
    const handleCreateBreed = () => {

    }
    return (
        <div>
            <Card style={styles.card} title={<Title level={2}>💰 Inventory</Title>}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '16px'
                }}>
                    <div style={styles.addCard} onClick={handleCreateBreed}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            padding: '16px'
                        }}>
                            <PlusOutlined style={{ fontSize: '24px', color: '#dfe1e6' }} />
                            <Text style={{ fontSize: '21px', fontWeight: 'bold', marginTop: '10px' }}>Breed your first bull!</Text>
                            <Text>This is the first step to collecting and breeding bulls</Text>
                        </div>
                    </div>
                    <Skeleton.Input style={styles.gameCard} />
                    <Skeleton.Input style={styles.gameCard} />
                    <Skeleton.Input style={styles.gameCard} />

                </div>
            </Card >
        </div >
    )
}

export default Collections
