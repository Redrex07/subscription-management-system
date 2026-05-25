import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function BillingHistory(){

const [subscriptions,setSubscriptions] = useState([]);
const [total,setTotal] = useState(0);

useEffect(()=>{

axios.get("http://localhost:5000/subscriptions/1")
.then(res=>{

setSubscriptions(res.data);

let sum = 0;

res.data.forEach(sub=>{
sum += Number(sub.price);
});

setTotal(sum);

})
.catch(err=>console.log(err));

},[]);



/* DOWNLOAD INVOICE */

const downloadInvoice = (sub) => {

const doc = new jsPDF();

doc.setFontSize(20);
doc.text("Subscription Invoice",20,20);

doc.setFontSize(12);

doc.text(`Service: ${sub.service_name}`,20,50);
doc.text(`Plan: ${sub.plan_type}`,20,60);
doc.text(`Price: ₹${sub.price}`,20,70);

doc.text(
`Start Date: ${new Date(sub.start_date).toDateString()}`,
20,
80
);

doc.text(
`Expiry Date: ${new Date(sub.expiry_date).toDateString()}`,
20,
90
);

doc.text("Status: Paid",20,110);

doc.save(`${sub.service_name}_invoice.pdf`);

};



return(

<div className="p-10 w-full">

{/* PAGE TITLE */}

<h1 className="text-2xl font-bold mb-8">
Billing History
</h1>


{/* TOTAL SPENDING */}

<div className="bg-white shadow rounded-xl p-6 mb-8 w-72">

<p className="text-gray-500">
Total Subscription Spending
</p>

<h2 className="text-3xl font-bold text-purple-600">
₹{total.toFixed(2)}
</h2>

</div>



{/* BILLING TABLE */}

<div className="bg-white shadow rounded-xl overflow-hidden">

<table className="w-full">

<thead className="bg-gray-100">

<tr>

<th className="p-4 text-left">Service</th>
<th className="p-4 text-left">Plan</th>
<th className="p-4 text-left">Price</th>
<th className="p-4 text-left">Start</th>
<th className="p-4 text-left">Expiry</th>
<th className="p-4 text-left">Invoice</th>

</tr>

</thead>

<tbody>

{subscriptions.map(sub=>(
<tr
key={sub.subscription_id}
className="border-t hover:bg-gray-50"
>

<td className="p-4 font-medium">
{sub.service_name}
</td>

<td className="p-4">
{sub.plan_type}
</td>

<td className="p-4 text-green-600 font-semibold">
₹{sub.price}
</td>

<td className="p-4">
{new Date(sub.start_date).toDateString()}
</td>

<td className="p-4">
{new Date(sub.expiry_date).toDateString()}
</td>

<td className="p-4">

<button
onClick={()=>downloadInvoice(sub)}
className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
>
Download
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

);

}