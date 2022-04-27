import axios from 'axios'
import {backEndurl} from '../const';
function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}';
}
export function service(setResult,text)
{
    axios.post(backEndurl+'/add',
    {
        data:text
    }).then(res=>{
        console.log("Servixce")
        console.log(res.data);
        console.log(res.status);
        if(res.status==200)
        {
            console.log(res.data)
            if(!isEmptyObject(res.data))
                setResult(res.data);
            else
                alert("Please type something before submit!")
        }
        else
        {
            alert("Error");
        }
    })
}