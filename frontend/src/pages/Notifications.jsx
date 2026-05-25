import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications(){

const [subs,setSubs] = useState([]);
const [notifications,setNotifications] = useState([]);

useEffect(()=>{

axios.get("http://localhost:5000/subscriptions/1")
.then(res=>{

setSubs(res.data);

const today = new Date();

const alerts = res.data.map(sub=>{

const expiry = new Date(sub.expiry_date);

const diff = Math.ceil((expiry - today)/(1000*60*60*24));

if(diff < 0){
return {
type:"expired",
message:`${sub.service_name} subscription has expired`,
days:diff
};
}

if(diff <= 7){
return {
type:"renewal",
message:`${sub.service_name} will renew in ${diff} days`,
days:diff
};
}

return null;

}).filter(Boolean);

setNotifications(alerts);

})
.catch(err=>console.log(err));

},[]);


return(

<div className="p-10 w-full">

<h1 className="text-2xl font-bold mb-8">
Notifications
</h1>


{notifications.length === 0 ? (

<div className="bg-white p-6 rounded shadow text-gray-500">
No new notifications 🎉
</div>

) : (

<div className="space-y-4">

{notifications.map((note,index)=>{

if(note.type === "renewal"){

return(
<div
key={index}
className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded"
>

⚠ {note.message}

</div>
);

}

if(note.type === "expired"){

return(
<div
key={index}
className="bg-red-100 border-l-4 border-red-500 p-4 rounded"
>

❌ {note.message}

</div>
);

}

return null;

})}

</div>

)}

</div>

);

}