import { Card, Col, Container,Row } from "react-bootstrap";

export default function Info()
{
    return <Container id="info">
        <Row style={{textAlign:"center"}}>
            <h1 style={{color:"white"}}>About</h1>
        </Row>
        <br></br>
        <br></br>
        <Row className="justify-content-md-center">
            <Col>
                <Card
                style={{ width: '15rem' ,height:'25rem',boxShadow:" 0 10px 20px 0 white",margin:20}}    
                >
                    <Card.Header>
                        AWS
                    </Card.Header>
                    <Card.Body>
                    This service is a interface for the free API that offers the Text Analysis from AWS.
                     That's why can't be used so many times till i can offer the full service.
                        
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card
                style={{ width: '15rem' ,height:'25rem',boxShadow:" 0 10px 20px 0 white",margin:20}}     
                >
                    <Card.Header>
                    For short
                    </Card.Header>
                    <Card.Body>
                        This service is using free service text analysis for your help to determine what's the meaning behind
                        
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card
                style={{ width: '15rem' ,height:'25rem',boxShadow:" 0 10px 20px 0 white",margin:20}}    
                >
                    <Card.Header>
                        More info
                    </Card.Header>
                    <Card.Body>
                         This website is build with react framework and express framework for backend.
                        Also for interface i used react bootstrap.
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}