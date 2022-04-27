export const userRedux=(state={
    //user:{role:"admin"}
    user:null 
    //user:{role:"user",name:"Ion",tiles:["Sentiment result","Language detection","Entity detection","Opinion mining"],history:[{text:"Ceva",sentiment:"Ceva",language:"Ceva",entity:"Ceva",opinion:"Ceva"}]}
},action)=>
{
    switch(action.type)
    {
        case "Login":
            return {...state,user:action.payload};
        case "Logout":
            return {...state,user:null};
        default:
            return state;
    }
}