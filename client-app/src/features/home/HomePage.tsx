import React from 'react'
import { Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <Container style={{ marginTop: "7em" }}>
            <Header as="h1">Home Page</Header>
            <h3>Go to <Link to="/activities">Activities</Link></h3>
        </Container>
    )
}

export default HomePage;