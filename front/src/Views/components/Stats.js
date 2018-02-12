import React, { Component } from 'react';
import '../../css/Stats.css'
import { Card, CardTitle, CardText, Row, Col, CardBody } from 'reactstrap';

class Stats extends Component {

    pokerhandInFinnish() {
        if(this.props.stats.winninghand === 'Pair') {
            return (<span>Pari</span>);
        }
        else if(this.props.stats.winninghand === 'TwoPairs') {
            return (<span>Kaksi Paria</span>);
        }
        else if(this.props.stats.winninghand === 'Trips') {
            return (<span>Kolmoset</span>);
        }
        else if(this.props.stats.winninghand === 'Straight') {
            return (<span>Suora</span>);
        }
        else if(this.props.stats.winninghand === 'Flush') {
            return (<span>Väri</span>);
        }
        else if(this.props.stats.winninghand === 'Fullhouse') {
            return (<span>Täysikäsi</span>);
        }
        else if(this.props.stats.winninghand === 'Quads') {
            return (<span>Neloset</span>);
        }
        else if(this.props.stats.winninghand === 'StraightFlush') {
            return (<span>Värisuora</span>);
        }
        else {
            return (<span></span>);
        }
    }

    render() {
        let pokerwon = (this.props.stats.pokerwinner !== undefined);
        console.log(this.props.stats.pokerwinner);

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
                
                    {pokerwon && <Card>
                        <CardBody>
                            <CardTitle>Pokerin voitti: {this.props.stats.pokerwinner}</CardTitle>
                            <CardText>
                                Käsi: {this.pokerhandInFinnish()}
                            </CardText>
                        </CardBody>
                    </Card>}
                </Col>
            </div>
        );
    }
}


export default Stats;