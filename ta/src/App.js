import * as Icon from 'react-bootstrap-icons'
import {Row,Col,Container,Button, Navbar} from 'react-bootstrap'

import MyNavbar from './Component/Navbar';
import About  from './Component/About';
import Analyzer from './Component/Analyzer';
import Info from './Component/Info'
import {useDispatch,useSelector} from 'react-redux'
import Admin from './Component/Admin';
function App() {

  const dispatch=useDispatch();
  const user=useSelector(state=>state.userRedux.user);

  const renderBody=()=>{
    if(user&&user.role=="admin")
    {
      return <Admin/>
    }
    else
    {
      return <>
      <MyNavbar></MyNavbar>
      <About>
      </About>
      {space(3)}
      <hr style={{color:"white",margin:20}}></hr>
      {space(1)}
      <Analyzer></Analyzer>
      {space(3)}
      <hr style={{color:"white",margin:20}}></hr>
      {space(2)}
      <Info></Info>
      {space(3)}
      </>
    }
  }
    

  const space=(many)=>
  {
    let manySpaces=[];
    for(let i=0;i<many;i++)
        manySpaces.push(<br></br>);
    return <>
    {manySpaces.map((el)=>el)}
    </>
  }
  return  <div className="App">
  {renderBody()}
  </div>
}

export default App;
