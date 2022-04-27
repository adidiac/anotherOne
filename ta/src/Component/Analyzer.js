import { Button, Col, Container,Row ,Spinner} from "react-bootstrap";
import { useState } from "react";
import { service } from "../Service/Service";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import axios from "axios";
import {backEndurl} from '../const';
export default function Analyzer()
{
    const user=useSelector(state=>state.userRedux.user);

    const [result, setResult] = useState(null);

     const render=(category)=>{
      if(!result)
      {
        return <>
          <p>
                Waiting for you to write something!
            </p>
        <Spinner animation="border"/>
        </>
      }
      else
      {
          if(category=="Sentiment result")
          {
            return <p>
                {result.sentiment}
            </p>

          }
          if(category=="Language detection")
          {
            return <p>
                {result.language}
            </p>
          }
          if(category=="Entity detection")
          {
            return <>
                {
                result.entity?result.entity.map((el)=>{
                    return <><br/><p>{el}</p><br/></>
                }):<></>
                }
            </>
          }
          if(category=="Opinion mining")
          {
            return <p>
                {result.opinion}
            </p>
          }
      }
    }

    //const tiles=["Sentiment result","Language detection","Language detection","Opinion mining"];
    const tiles=user?["Sentiment result",...user.tiles]:["Sentiment result"];
    const onSubmit=()=>{
        const text=document.getElementById('inputText').value;
        console.log(text);
        service(setResult,text);
        document.getElementById('inputText').value='';
        if(user)
        {
            console.log(result);
            user.history.push({text:text,sentiment:result.sentiment,language:result.language,entity:result.entity,opinion:result.opinion});
            axios.post(backEndurl+"/updateHistory",{email:user.email,history:user.history}).then(result=>{
                console.log(result.data);
            }
            ).catch(err=>{
                console.log(err);
            }
            )

        }
    }

    const card=(Text)=>
    {
        return <>
        <br></br>
        <Row>
            <div class="card1">
        <div class="container1" style={{textAlign:"center"}}>
            <h4><b>{Text}</b></h4>
            <br></br>
            <p>
                {render(Text)}
            </p>
        </div>
        </div></Row>
        <br></br>
        </>
    }

   

    return <Container id="analyzer">
         <Col style={{padding:20,marginTop:30}}>
         <Row style={{textAlign:"center"}}>
             <h1 style={{color:"white",fontFamily:"Palette Mosaic"}}> The analyzer</h1>
         </Row>
         <br></br>
         <br></br>
         <Row>
            <textarea 
            id="inputText"
            placeholder={"here comes your text..."}
             class="form-control input-lg"
              style={{boxShadow:"0px 0px 8px 0px white",backgroundColor:"rgba(255,255, 255, 1)",borderRadius:"20px",color:"black",height:150}}>
            </textarea>
         </Row>
         <Row>
         <Col md={{offset: 10}}>
             <Button style={{width:100,margin:10}} onClick={onSubmit}>
                 Submit
             </Button>
             </Col>
         </Row>
         <br></br>
         <br></br>
         <Row style={{textAlign:"center"}}>
             <h1 style={{color:"white",fontFamily:"Palette Mosaic"}}>The results</h1>
         </Row>
         <br></br>
         <br></br>
         {
         tiles.map(el=>{
             return card(el)
            })
        }
        {user?<></>:<hr></hr>}
        <Row>
            {
                user?<></>:
                <Row>
                <div class="card1">
            <div class="container1" style={{textAlign:"center"}}>
                <p style={{fontFamily:"Palette Mosaic"}}>
                    You are now in guest mode! If you want to see the results of "Language detection","Entity detection","Opinion mining" analyzer, please sign up and buy them!
                </p>
                </div>
                </div>
                </Row>
            }
        </Row>
         </Col>
    </Container>
}