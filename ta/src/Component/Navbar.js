import { Nav,Navbar,Button} from "react-bootstrap";
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import ModalUser from "./ModalUser";
import ModalLogin from "./ModalLogin";
import TableModal from "./TableModal";
export default function MyNavbar()
{

    const dispatch=useDispatch();
    const user=useSelector(state=>state.userRedux.user);
    const [showLogin,setShowLogin]=useState(false);
    const [showUser,setShowUser]=useState(false);
    const [showTable,setShowTable]=useState(false);


    return (
      <>
    <Navbar collapseOnSelect expand="lg" 
    style={{background:"linear-gradient(90deg, rgba(67,18,98,1) 0%, rgba(178,12,255,1) 49%, rgba(53,9,57,1) 100%)",
    color:"white",}}>
    <Navbar.Brand href="" style={{color:"white",fontSize:40,marginLeft:30}}>
    {' '}Text Analysis
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
      <Navbar.Brand>
        <Button style={{width:60,height:60,margin:10,borderRadius:"100%",fontSize:13,border:"2px solid white",paddingLeft:4}}
        onClick={()=>{
            if(user)
            {
              setShowUser(true);
            }
            else
              setShowLogin(true);
        }}>
                {user?user.name:'Login'}
              </Button>
      </Navbar.Brand>
      <Navbar.Brand href="#analyzer">
        <Button style={{width:60,height:60,margin:10,borderRadius:"100%",fontSize:13,border:"2px solid white",paddingLeft:4}}>
                Analyzer
              </Button>
      </Navbar.Brand>
      <Navbar.Brand href="#info">
        <Button style={{width:60,height:60,margin:10,borderRadius:"100%",fontSize:13,border:"2px solid white",paddingLeft:10}}>
                About
              </Button>
      </Navbar.Brand>
      <Navbar.Brand >
        <Button onClick={()=>{setShowTable(true)}}
         style={{width:60,height:60,margin:10,borderRadius:"100%",fontSize:13,border:"2px solid white",paddingLeft:10}}>
                Table
              </Button>
      </Navbar.Brand>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  <ModalUser show={showUser} setShow={setShowUser}/>
  <ModalLogin show={showLogin} setShow={setShowLogin}/>
  <TableModal show={showTable} setShow={setShowTable}/>
  </>
  );
}