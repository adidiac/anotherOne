import { Card, Container ,Row,Col} from "react-bootstrap";
import Clip from '../Images/clip.gif'
export default function About()
{
    return <Container>
        <Row>
            <Col>
            <img style={{width:400,height:300}} src={Clip} alt={"Loading"}></img>
            </Col>
            <Col style={{textAlign:"center",position:"relative",padding:50}}>
            <div class="card1">
            <div class="container1">
                <h4><b style={{fontFamily:"Palette Mosaic"}}>Complex Text Analyzer</b></h4>
                <p style={{textAlign:"center"}}>
                    This is a complext text analyzer that can help you many tasks for your text.This service can offer sentiment analyses over your text,
                    opinion mining over the text,language detection, entity recognition and entity linking. Imagine that 
                    this service offers you what the author actually wanted to say about the curtains without bothering you :) 
                </p>
            </div>
            </div>
            </Col>
        </Row>
    </Container>
}