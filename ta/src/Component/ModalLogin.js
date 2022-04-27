import {Modal, Button,Tab,Container,Row,Col,Form} from 'react-bootstrap';
import { useState } from "react";
import {useDispatch,useSelector} from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import {backEndurl} from '../const';
export default function ModalLogin({show,setShow})
{
    const [body,setBody]=useState(0);
    const [services,SetServices]=useState([]);
    const [tiles,setTiles]=useState([])
    const [totalPrice,setTotalPrice]=useState(0);
    const dispatch=useDispatch();
    const findPricebyTile=(tile)=>{
        let price=0;
        for(let i=0;i<tiles.length;i++)
        {
            if(tiles[i].name==tile)
            {
                price=tiles[i].price;
                break;
            }
        }
        return price;
    }


    const getTiles=()=>{
        //TODO: get tiles from database
        axios.get(backEndurl+"/services").then(result=>{
            console.log(result.data);
            setTiles(result.data);
        }).catch(err=>{
            console.log(err);
        })
    }

    const login=(email,password)=>{
        //TODO: send login
        axios.post(backEndurl+'/login',{email:email,password:password}).then(
            result=>{
                console.log(result.data);
                if(result.data==="User not found"){
                    alert("User not found");
                }else{
                    dispatch({type:"Login",payload:result.data});
                }}
        ).catch(err=>{
            console.log(err);
        })
    }
    const register=(name,email,password)=>{
        console.log(name,email,password);
        //TODO: send register
        axios.post(backEndurl+'/register',{name:name,email:email,password:password,tiles:services}).then(
            result=>{
                console.log(result.data);
                if(result.data==="User already exists"){
                    alert("User already exists");
                }else{
                    alert("User created");
                    dispatch({type:"Login",payload:result.data});
                }
            }).catch(err=>{
                console.log(err);
            }
        )
    }
        



    const addToTotal=(price)=>{
        setTotalPrice(totalPrice+price);
    }
    const removeFromTotal=(price)=>{
        setTotalPrice(totalPrice-price);
    }
    const checkIfExist=(service)=>{
        for(let i=0;i<services.length;i++)
        {
            if(services[i]==service)
            {
                console.log("exist");
                return true;
            }
        }
        return false;
    }
    const addService=(service)=>{
        SetServices([...services,service]);
    }
    const deleteService=(service)=>{
        SetServices(services.filter(s=>s!==service));
    }

    const renderBody=()=>{
        if(!body)
        {
            return <>
                <Form onSubmit={(e)=>{
                    e.preventDefault();
                    login(e.target[0].value,e.target[1].value);
                }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={()=>{setShow(false);setBody(0)}}>
                    Login
                </Button>`
                
                <Button variant="primary" onClick={()=>{setBody(1)}} >
                    Register
                </Button>
                </Form>
            </>
        }
        else
        {
            return <>
            <Form
             onSubmit={(e)=>{
                e.preventDefault();
                register(e.target[0].value,e.target[1].value,e.target[2].value);
                setShow(false);setBody(0);
            }
             }>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Your name</Form.Label>
                    <Form.Control type="text" placeholder="Your name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <hr></hr>
                <Row>
                    <Col>
                        <h7>Language detection</h7>
                    </Col>
                    <Col>
                        <h7>Price {findPricebyTile("Language detection")}$</h7>
                    </Col>
                    <Col>
                    {checkIfExist("Language detection")?
                        <Button variant="danger" onClick={()=>{deleteService("Language detection");removeFromTotal(findPricebyTile("Language detection"))}}>
                            Remove
                        </Button>:
                        <Button variant="primary" onClick={()=>{addService("Language detection");addToTotal(findPricebyTile("Language detection"))}}>
                            Add
                        </Button>
            }
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col>
                        <h7>Entity detection</h7>
                    </Col>
                    <Col>
                        <h7>Price {findPricebyTile("Entity detection")} $</h7>
                    </Col>
                    <Col>
                    {checkIfExist("Entity detection")?
                        <Button variant="danger" onClick={()=>{deleteService("Entity detection");removeFromTotal(findPricebyTile("Entity detection"))}}>
                            Remove
                        </Button>:
                        <Button variant="primary" onClick={()=>{addService("Entity detection");addToTotal(findPricebyTile("Entity detection"))}}>
                            Add
                        </Button>
                    }       
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col>
                        <h7>Opinion mining</h7>
                    </Col>
                    <Col>
                        <h7>Price {findPricebyTile("Opinion mining")}$</h7>
                    </Col>
                    <Col>
                    {checkIfExist("Opinion mining")?
                        <Button variant="danger" onClick={()=>{deleteService("Opinion mining");removeFromTotal(findPricebyTile("Opinion mining"))}}>
                            Remove
                        </Button>:
                        <Button variant="primary" onClick={()=>{addService("Opinion mining");addToTotal(findPricebyTile("Opinion mining"))}}>
                            Add
                        </Button>
                     }
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col>
                        <h7>Total price : {totalPrice}</h7>
                    </Col>
                </Row>
                <hr></hr>
                <Button variant="primary" type='submit'  >
                    Register
                </Button>
                </Form>
            
            </>
        }
    
    
    }

    useEffect(()=>{
        if(show)
            getTiles();
    },[]);

    return (<Modal show={show} onHide={()=>{setShow(false);setBody(0)}}>
    <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Container>
        {renderBody()}
        </Container>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={()=>{setShow(false);setBody(0)}}>
            Close
        </Button>
    </Modal.Footer>
    </Modal>
    );
}