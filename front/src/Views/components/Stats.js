import React, { Component } from 'react';
import '../../css/Stats.css'
import { Card, CardTitle, CardText, Row, Col, CardBody } from 'reactstrap';

class Stats extends Component {

    render() {
        return (
            <div>
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle>Tikin voitti: {this.props.stats.tikkiwinner}</CardTitle>
                            <CardText>
                                {this.props.stats.twoEnd}
                            </CardText>
                        </CardBody>
                    </Card>
                
                    <Card>
                        <CardBody>
                            <CardTitle>Pokerin voitti: {this.props.stats.pokerwinner}</CardTitle>
                            <CardText>
                                Käsi: {this.props.stats.winninghand}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
            </div>
        );
    }
}


export default Stats;