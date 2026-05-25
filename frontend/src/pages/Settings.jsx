import { useState } from "react";
import toast from "react-hot-toast";

export default function Settings(){

const [settings,setSettings] = useState({
name:"Rohan",
email:"rohan@example.com",
currency:"INR",
notifications:true,
darkmode:false
});


const handleChange = (e)=>{

const {name,value,type,checked} = e.target;

setSettings({
...settings,
[name]: type === "checkbox" ? checked : value
});

};


const saveSettings = () =>{

localStorage.setItem("userSettings", JSON.stringify(settings));

toast.success("Settings saved successfully");

};


return(

<div className="p-10 w-full">

<h1 className="text-2xl font-bold mb-8">
Settings
</h1>


<div className="grid grid-cols-2 gap-8">


{/* PROFILE SECTION */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-lg font-semibold mb-4">
Profile Information
</h2>

<div className="mb-4">

<label className="text-gray-500 text-sm">
Full Name
</label>

<input
name="name"
value={settings.name}
onChange={handleChange}
className="border p-2 rounded w-full"
/>

</div>


<div>

<label className="text-gray-500 text-sm">
Email Address
</label>

<input
name="email"
value={settings.email}
onChange={handleChange}
className="border p-2 rounded w-full"
/>

</div>

</div>



{/* APP SETTINGS */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-lg font-semibold mb-4">
Application Settings
</h2>


<div className="mb-4">

<label className="text-gray-500 text-sm">
Currency
</label>

<select
name="currency"
value={settings.currency}
onChange={handleChange}
className="border p-2 rounded w-full"
>

<option value="INR">₹ Indian Rupee</option>
<option value="USD">$ US Dollar</option>
<option value="EUR">€ Euro</option>

</select>

</div>


<div className="flex justify-between items-center mb-4">

<label>Email Notifications</label>

<input
type="checkbox"
name="notifications"
checked={settings.notifications}
onChange={handleChange}
/>

</div>


<div className="flex justify-between items-center">

<label>Dark Mode</label>

<input
type="checkbox"
name="darkmode"
checked={settings.darkmode}
onChange={handleChange}
/>

</div>

</div>



{/* SAVE BUTTON */}

<div className="col-span-2">

<button
onClick={saveSettings}
className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
>
Save Settings
</button>

</div>

</div>

</div>

);

}