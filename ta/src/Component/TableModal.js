import { Container,Modal,Row,Col,Table,Button,Form } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { backEndurl } from "../const";
export default function TableModal({show,setShow})
{
    const [data,setData]=useState([{Nume:"",Adresa:"",Timestamp:"",Result:""}]);

    const getData=()=>{
        //TODO: get data from database
        console.log("get data");
        axios.get(backEndurl+"/getAllData").then(result=>{
            console.log(result.data);
            console.log("intra aici");
            setData(result.data);
        }).catch(err=>{
            console.log(err);
        }
        )
    }
    const headersWithFile=()=>
        {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data'},
            }
            return config
        }

    

    const sendFile=(file)=>{
        let formData=new FormData();
        formData.append('file',file);
        axios.post(backEndurl+"/addFile",formData,headersWithFile()).then(result=>{
            console.log(result.data);
            console.log("intra aici2");
            setData(result.data);
            //getData();
        }).catch(err=>{
            console.log(err);
        })
    }
    useEffect(()=>{
        getData();
    },[])

    return <Modal show={show} onHide={()=>setShow(false)}  >
    <Modal.Header closeButton>
        <Modal.Title>Table Result</Modal.Title>
    </Modal.Header>
    <Modal.Body  >
        <Container  style={{overflowY:"scroll"}}>
            <Form onSubmit={(e)=>{e.preventDefault();
                console.log(e.target[0].files[0]);
                sendFile(
                    e.target[0].files[0],
                )
            }}>
            
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Table striped bordered hover style={{fontSize:7}} >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nume</th>
                        <th>Adresa</th>
                        <th>Timestamp</th>
                        <th>Rezultat</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((el,index)=>{
                            return <tr>
                                <td style={{maxWidth:"10px"}}>{index+1}</td>
                                <td style={{maxWidth:"10px"}}>{el.Nume}</td>
                                <td style={{maxWidth:"10px"}}><a href={el.Adresa}>Link</a></td>
                                <td style={{maxWidth:"10px"}}>{el.Timestamp}</td>
                                <td style={{maxWidth:"10px"}}>{el.Rezultat}</td>
                            </tr>
                        })  
                    }
                </tbody>
            </Table>
        </Container>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={()=>setShow(false)}>
            Close
        </Button>
    </Modal.Footer>
    </Modal>


}