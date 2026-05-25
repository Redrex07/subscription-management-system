import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function AddSubscription() {

const navigate = useNavigate();
const { id } = useParams();

const [form, setForm] = useState({
service_name:"",
category:"",
plan_type:"",
price:"",
start_date:"",
expiry_date:""
});

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};


useEffect(()=>{

if(id){

axios.get(`http://localhost:5000/subscription/${id}`)
.then(res=>{

const data = res.data;

setForm({
service_name:data.service_name || "",
category:data.category || "",
plan_type:data.plan_type || "",
price:data.price || "",
start_date:data.start_date?.split("T")[0] || "",
expiry_date:data.expiry_date?.split("T")[0] || ""
});

});

}

},[id]);


const handleSubmit = async (e)=>{

e.preventDefault();

try{

if(id){

await axios.put(
`http://localhost:5000/update-subscription/${id}`,
form
);

toast.success("Subscription updated successfully");

}else{

await axios.post(
"http://localhost:5000/add-subscription",
{
service_name:form.service_name,
category:form.category,
plan_type:form.plan_type,
price:Number(form.price),
start_date:form.start_date,
expiry_date:form.expiry_date
}
);

toast.success("Subscription added successfully 🎉");

}

navigate("/subscriptions");

}catch(err){

console.error(err);
toast.error("Error saving subscription");

}

};


return(

<div className="p-10 w-full">

{/* PAGE TITLE */}

<h1 className="text-2xl font-bold mb-8">
{id ? "Edit Subscription" : "Add Subscription"}
</h1>

<form
onSubmit={handleSubmit}
className="grid grid-cols-2 gap-6 max-w-4xl bg-white p-8 rounded-xl shadow"
>

{/* SERVICE NAME */}

<div className="flex flex-col">
<label className="text-sm mb-1 text-gray-600">
Service Name
</label>

<input
name="service_name"
placeholder="Netflix / Spotify"
value={form.service_name}
onChange={handleChange}
required
className="p-3 border rounded"
/>
</div>


{/* CATEGORY */}

<div className="flex flex-col">
<label className="text-sm mb-1 text-gray-600">
Category
</label>

<select
name="category"
value={form.category}
onChange={handleChange}
required
className="p-3 border rounded"
>
<option value="">Select Category</option>
<option>Entertainment</option>
<option>Music</option>
<option>Education</option>
<option>Productivity</option>
<option>Cloud</option>
<option>Developer</option>
<option>Shopping</option>
<option>AI Tools</option>
</select>
</div>


{/* PLAN TYPE */}

<div className="flex flex-col">
<label className="text-sm mb-1 text-gray-600">
Plan Type
</label>

<select
name="plan_type"
value={form.plan_type}
onChange={handleChange}
required
className="p-3 border rounded"
>
<option value="">Select Plan</option>
<option value="Monthly">Monthly</option>
<option value="Yearly">Yearly</option>
</select>
</div>


{/* PRICE */}

<div className="flex flex-col">
<label className="text-sm mb-1 text-gray-600">
Price (₹)
</label>

<input
name="price"
type="number"
placeholder="Enter price"
value={form.price}
onChange={handleChange}
required
className="p-3 border rounded"
/>
</div>


{/* START DATE */}

<div className="flex flex-col">
<label className="text-sm mb-1 text-gray-600">
Start Date
</label>

<input
name="start_date"
type="date"
value={form.start_date}
onChange={handleChange}
required
className="p-3 border rounded"
/>
</div>


{/* EXPIRY DATE */}

<div className="flex flex-col">
<label className="text-sm mb-1 text-gray-600">
Expiry Date
</label>

<input
name="expiry_date"
type="date"
value={form.expiry_date}
onChange={handleChange}
required
className="p-3 border rounded"
/>
</div>


{/* BUTTONS */}

<div className="col-span-2 flex gap-4 mt-4">

<button
type="submit"
className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
>
{id ? "Update Subscription" : "Add Subscription"}
</button>

<button
type="button"
onClick={()=>navigate("/subscriptions")}
className="bg-gray-200 px-6 py-3 rounded hover:bg-gray-300"
>
Cancel
</button>

</div>

</form>

</div>

);
}