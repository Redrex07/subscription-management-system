import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login(){

const navigate = useNavigate();

const [form,setForm] = useState({
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

const res = await axios.post(
"http://localhost:5000/login",
form
);

localStorage.setItem("user_id",res.data.user_id);

toast.success("Login successful");

/* ✅ CHANGED LINE */
window.location.href = "/";

}catch(err){

toast.error("Invalid login");

}

};

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<form
onSubmit={handleSubmit}
className="bg-white p-8 rounded-lg shadow w-80"
>

<h2 className="text-xl font-bold mb-6 text-center">
Login
</h2>

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
Login
</button>

<p className="text-sm text-center mt-4">
New user?{" "}
<span
onClick={()=>navigate("/signup")}
className="text-purple-600 cursor-pointer"
>
Create account
</span>
</p>

</form>

</div>

);
}