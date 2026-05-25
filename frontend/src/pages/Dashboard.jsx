import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer
} from "recharts";

export default function Dashboard(){

const navigate = useNavigate();

const [stats,setStats] = useState({
active:0,
expired:0,
monthly_spending:0,
upcoming:0
});

const [chartData,setChartData] = useState([]);
const [subscriptions,setSubscriptions] = useState([]);


/* SERVICE LOGOS */

const logos = {
  // Entertainment
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


useEffect(()=>{

axios.get("http://localhost:5000/dashboard/1")
.then(res=>{
setStats(res.data);
})
.catch(err=>console.log(err));

axios.get("http://localhost:5000/monthly-spending/1")
.then(res=>{
setChartData(res.data);
})
.catch(err=>console.log(err));

axios.get("http://localhost:5000/subscriptions/1")
.then(res=>{
setSubscriptions(res.data);
})
.catch(err=>console.log(err));

},[]);


/* DAYS LEFT FUNCTION */

const daysLeft = (date) => {

const today = new Date();
const expiry = new Date(date);

const diff = expiry - today;

return Math.ceil(diff / (1000 * 60 * 60 * 24));

};


return(

<div className="p-10 w-full min-h-screen bg-gray-100">

{/* HEADER */}

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold">
Dashboard
</h1>

<button
onClick={()=>navigate("/add")}
className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
>
+ Add Subscription
</button>

</div>


{/* STAT CARDS */}

<div className="grid grid-cols-4 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
<img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" className="w-10"/>
<div>
<p className="text-gray-500">Active Subscriptions</p>
<h2 className="text-3xl font-bold text-green-600">
{stats.active}
</h2>
</div>
</div>

<div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
<img src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png" className="w-10"/>
<div>
<p className="text-gray-500">Monthly Spending</p>
<h2 className="text-3xl font-bold text-blue-600">
₹{stats.monthly_spending}
</h2>
</div>
</div>

<div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
<img src="https://cdn-icons-png.flaticon.com/512/1827/1827349.png" className="w-10"/>
<div>
<p className="text-gray-500">Upcoming Renewals</p>
<h2 className="text-3xl font-bold text-orange-500">
{stats.upcoming}
</h2>
</div>
</div>

<div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
<img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" className="w-10"/>
<div>
<p className="text-gray-500">Expired</p>
<h2 className="text-3xl font-bold text-red-500">
{stats.expired}
</h2>
</div>
</div>

</div>


{/* CHART */}

<div className="bg-white p-6 rounded-xl shadow mb-10">

<h2 className="text-xl font-semibold mb-4">
Monthly Subscription Spending
</h2>

{chartData.length === 0 ? (

<p className="text-gray-400">
No subscription data available
</p>

) : (

<ResponsiveContainer width="100%" height={350}>

<BarChart data={chartData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="spending" fill="#7c3aed" radius={[6,6,0,0]}/>

</BarChart>

</ResponsiveContainer>

)}

</div>


{/* RENEWAL ALERTS */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Upcoming Renewal Alerts
</h2>

{subscriptions
.filter(sub => daysLeft(sub.expiry_date) <= 7 && daysLeft(sub.expiry_date) >= 0)
.length === 0 ? (

<p className="text-gray-500">
No subscriptions expiring soon
</p>

) : (

<div className="space-y-3">

{subscriptions
.filter(sub => daysLeft(sub.expiry_date) <= 7 && daysLeft(sub.expiry_date) >= 0)
.map(sub => (

<div
key={sub.subscription_id}
className="flex items-center justify-between bg-yellow-50 p-3 rounded"
>

<div className="flex items-center gap-3">

<img
src={logos[sub.service_name] || "https://cdn-icons-png.flaticon.com/512/565/565547.png"}
className="w-7"
/>

<span className="font-medium">
{sub.service_name}
</span>

</div>

<span className="text-orange-600 text-sm">
{daysLeft(sub.expiry_date)} days left
</span>

</div>

))}

</div>

)}

</div>

</div>

);
}