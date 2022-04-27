import { Container,Row,Col,Button,Form } from "react-bootstrap";
import { useDispatch,useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import {backEndurl} from '../const';
export default function Admin(){
    const dispatch=useDispatch();

    const [tiles,setTiles]=useState([{name:"Sentiment result",price:20,numberAbonati:2},{name:"Language detection",price:20,numberAbonati:2},
    {name:"Entity detection",price:20,numberAbonati:2},{name:"Opinion mining",price:20,numberAbonati:2}]);

    const [users,setUsers]=useState([{name:"Ion",email:"ion@gmail.com",tiles:["Sentiment result","Language detection","Entity detection","Opinion mining"],history:[
        {text:"",sentiment:"",language:"",entity:"",opinion:""},
    ]}]);

    const getTiles=()=>{
        //TODO: get tiles from database
        axios.get(backEndurl+"/services").then(result=>{
            console.log(result.data);
            setTiles(result.data);
        }).catch(err=>{
            console.log(err);
        })
    }

    const updateTile=(tile,price)=>{
        //TODO: update tile in database
        axios.post(backEndurl+"/updatePrice",{name:tile,price:price}).then(result=>{
            console.log(result.data);
            getTiles();
        }).catch(err=>{
            console.log(err);
        });
    }

    const getAllUsers=()=>{
        //TODO: get all users from database
        axios.get(backEndurl+"/users").then(result=>{
            console.log(result.data);
            setUsers(result.data);
        }).catch(err=>{
            console.log(err);
        })
    }
    const deleteUser=(user)=>{
        //TODO: delete user from database
        axios.post(backEndurl+"/deleteUser",{email:user.email}).then(result=>{
            console.log(result.data);
            getAllUsers();
        }).catch(err=>{
            console.log(err);
        })

    }

    useEffect(()=>{
        getTiles();
        getAllUsers();
    },[]);

    return <Container style={{textAlign:'center',color:'white'}}>
    <Row style={{margin:20}}>
        <Col>
             <h1>Admin Helper</h1>
        </Col>
        <Col>
        <Button onClick={()=>{dispatch({type:'Logout'})}}>Logout</Button>
        </Col>
    </Row>
    <hr></hr>
    <Row>
        Services available:
    </Row>
    <br></br>
    <Row>
        {
            tiles.map((el)=>{
                return <Col>
                     <div class="card1" style={{textAlign:'center',color:'black',fontSize:20}}>
                        <div class="container1" style={{textAlign:"center"}}>
                        <h4><b>{el.name}</b></h4>
                        <br></br>
                        <h7>
                            Price: {el.price}
                        </h7>
                        <br></br>
                        <h7>Number of subscribers: {el.numberAbonati}</h7>
                        <br></br>
                        <Form onSubmit={(e)=>{
                            e.preventDefault();
                            updateTile(el.name,e.target[0].value);
                        }}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Price</Form.Label>
                                <Form.Control type="number" placeholder="Enter price" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Update
                            </Button>
                        </Form>
                        </div>
                    </div>
                </Col>
            })
        }
    </Row>
    <br></br>
    <Row>
        Users:
    </Row>
    <br></br>
    <Row>
        {
            users.map((el)=>{
                return <Col>
                    <div class="card1" style={{textAlign:'center',color:'black',fontSize:20}}>
                        <div class="container1" style={{textAlign:"center"}}>
                        <h4><b>{el.name}</b></h4>
                        <br></br>
                        <h7>
                            Email: {el.email}
                        </h7>
                        <br></br>
                        <h7>
                            Tiles: {el.tiles.join(', ')}
                        </h7>
                        <br></br>
                        <h7>
                            History length:{el.history.length}
                        </h7>
                        <br></br>
                        <Button onClick={()=>{deleteUser(el)}}>Delete</Button>
                        </div>
                    </div>
                </Col>
            })
        }
    </Row>
    </Container>
}