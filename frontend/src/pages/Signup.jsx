import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup(){

const navigate = useNavigate();

const [form,setForm] = useState({
name:"",
email:"",
password:""
});

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const handleSubmit = async (e)=>{

e.preventDefault();

try{

await axios.post(
"http://localhost:5000/signup",
form
);

toast.success("Account created");

navigate("/login");

}catch(err){

toast.error("Signup failed");

}

};

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<form
onSubmit={handleSubmit}
className="bg-white p-8 rounded-lg shadow w-80"
>

<h2 className="text-xl font-bold mb-6 text-center">
Create Account
</h2>

<input
name="name"
placeholder="Name"
onChange={handleChange}
className="w-full border p-2 mb-4 rounded"
/>

<input
name="email"
placeholder="Email"
onChange={handleChange}
className="w-full border p-2 mb-4 rounded"
/>

<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
className="w-full border p-2 mb-4 rounded"
/>

<button
type="submit"
className="w-full bg-purple-600 text-white py-2 rounded"
>
Signup
</button>

<p className="text-sm text-center mt-4">
Already have account?{" "}
<span
onClick={()=>navigate("/login")}
className="text-purple-600 cursor-pointer"
>
Login
</span>
</p>

</form>

</div>

);

}