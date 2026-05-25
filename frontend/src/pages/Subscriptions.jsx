import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Subscriptions(){

const [subscriptions,setSubscriptions] = useState([]);
const [search,setSearch] = useState("");

const navigate = useNavigate();


const fetchSubs = () => {

axios.get("http://localhost:5000/subscriptions/1")
.then(res=>{
setSubscriptions(res.data);
})
.catch(err=>{
console.error(err);
});

};


useEffect(()=>{
fetchSubs();
},[]);



const deleteSubscription = async (id) => {

try{

await axios.delete(`http://localhost:5000/delete-subscription/${id}`);

toast.success("Subscription deleted");

fetchSubs();

}catch(err){

console.error(err);
toast.error("Delete failed");

}

};



/* SERVICE LOGOS */

const serviceLogos = {
Netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  PrimeVideo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
  DisneyPlus: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
  Hotstar: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",

  // Music
  Spotify: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
  AppleMusic: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Apple_Music_icon.svg",
  YouTubeMusic: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Youtube_Music_icon.svg",

  // Education
  Udemy: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg",
  Coursera: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg",
  Udacity: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Udacity_logo.svg",
  Skillshare: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Skillshare_logo.svg",

  // Productivity
  Notion: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  Evernote: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Evernote_logo_2018.svg",
  Microsoft365: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Microsoft_365_%282022%29.svg",
  GoogleOne: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_One_logo.svg",

  // Cloud / Storage
  GoogleDrive: "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png",
  Dropbox: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg",
  OneDrive: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_OneDrive_logo.svg",

  // Developer Tools
  GitHub: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  GitLab: "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg",
  Vercel: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg",

  // Shopping
  Amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  Flipkart: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Flipkart_logo.png",

  // AI Tools
  ChatGPT: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  Midjourney: "https://upload.wikimedia.org/wikipedia/commons/2/24/Midjourney_Emblem.png"
};



/* DAYS LEFT FUNCTION */

const daysLeft = (date) => {

const today = new Date();
const expiry = new Date(date);

const diff = expiry - today;

return Math.ceil(diff / (1000 * 60 * 60 * 24));

};



return(

<div className="p-10 w-full">


{/* HEADER */}

<div className="flex justify-between items-center mb-6">

<h1 className="text-2xl font-bold">
My Subscriptions
</h1>

<button
onClick={()=>navigate("/add")}
className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
>
+ Add Subscription
</button>

</div>



{/* SEARCH BAR */}

<input
type="text"
placeholder="Search subscriptions..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border p-2 rounded mb-8 w-72"
/>



{/* SUBSCRIPTIONS GRID */}

{subscriptions.length === 0 ? (

<p className="text-gray-500">
No subscriptions found.
</p>

) : (

<div className="grid grid-cols-3 gap-6">

{subscriptions
.filter(sub =>
(sub.service_name || "").toLowerCase().includes(search.toLowerCase())
)
.map((sub)=>(
<div
key={sub.subscription_id}
className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
>


{/* TITLE + PRICE */}

<div className="flex justify-between items-center">

<div className="flex items-center gap-3">

<img
src={serviceLogos[sub.service_name] || "https://cdn-icons-png.flaticon.com/512/565/565547.png"}
className="w-7 h-7"
/>

<h2 className="text-lg font-semibold">
{sub.service_name || "Unknown Service"}
</h2>

</div>

<span className="text-green-600 font-bold">
₹{sub.price}
</span>

</div>


<p className="text-gray-500 mt-1">
{sub.category}
</p>


<p className="text-purple-600 font-semibold mt-2">
{sub.plan_type}
</p>


{/* DATES */}

<div className="text-sm text-gray-500 mt-3">

<p>Start: {sub.start_date ? new Date(sub.start_date).toDateString() : "N/A"}</p>
<p>Expiry: {sub.expiry_date ? new Date(sub.expiry_date).toDateString() : "N/A"}</p>

</div>



{/* DAYS LEFT BADGE */}

<div className="mt-2">

<span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">

{daysLeft(sub.expiry_date)} days left

</span>

</div>



{/* ACTION BUTTONS */}

<div className="flex gap-3 mt-5">

<button
onClick={()=>navigate("/add", { state: sub })}
className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
>
Edit
</button>

<button
onClick={()=>deleteSubscription(sub.subscription_id)}
className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
Delete
</button>

</div>


</div>

))}

</div>

)}

</div>

);

}