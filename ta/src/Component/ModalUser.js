import {Modal, Button,Tab,Container,Row,Col} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import { backEndurl } from '../const';
export default function ModalUser({show,setShow})
{
    const user=useSelector(state=>state.userRedux.user);
    const dispatch=useDispatch();
    const [history,setHistory]=useState([]);


    const getHistory=()=>{
        //TODO: get history from database

        axios.post(backEndurl+"/getHistory",{email:user.email}).then(result=>{
            console.log(result.data);
            setHistory(result.data);
        }).catch(err=>{
            console.log(err);
        })  
    }

    const checkIfExist=(service)=>{
        for(let i=0;i<user.tiles.length;i++)
        {
            if(user.tiles[i]==service)
            {
                console.log("exist");
                return true;
            }
        }
        return false;
    }

    useEffect(()=>{
        if(user)
            getHistory();
    },[])

    return (<Modal show={show} onHide={()=>setShow(false)}>
    <Modal.Header closeButton>
        <Row>
            <Col>
        <Modal.Title>{user?user.name:<></>}</Modal.Title>
            </Col>
            <Col>
        <Button onClick={()=>{dispatch({type:"Logout"});setShow(false)}}>Logout</Button>
        </Col>
        </Row>
    </Modal.Header>
    <Modal.Body>
        <Container style={{overflowY:"scroll",maxHeight:300}}>
            <Row>
                <h4>Subscriptions:</h4>
                {
                    //print tiles of user
                    user?user.tiles.map((el)=>{
                        return <Tab.Pane eventKey={el}>
                            {el}
                        </Tab.Pane>
                    }):<></>
                }
            </Row>
            <br></br>
            <h4>History:</h4>
            {//["Sentiment result","Language detection","Entity detection","Opinion mining"]
            user?user.history.map((el)=>{
                return <>
                <Row>
                    <Col>
                         <p>Text :{el.text}</p>
                    </Col>
                    <Col>
                       <p>Sentiment :{el.sentiment}</p>
                    </Col>
                    <Col>
                    {checkIfExist("Language detection")?<p>Language: {el.language}</p>:<></>}
                    </Col>
                    <Col>
                         {checkIfExist("Entity detection")?<p>Entity: {el.entity}</p>:<></>}
                    </Col>
                    <Col>
                        {checkIfExist("Opinion mining")? <p>Opinion: {el.opinion}</p>:<></>}
                    </Col>
                </Row>
                <hr></hr>
                </>
            }):<></>}
        </Container>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={()=>setShow(false)}>
            Close
        </Button>
    </Modal.Footer>
    </Modal>
    );
}