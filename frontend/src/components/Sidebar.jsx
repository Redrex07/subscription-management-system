import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {

const navigate = useNavigate();

const logout = () => {

localStorage.clear();

navigate("/login");

};

return (

<div className="w-64 min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 text-white p-6">

<h1 className="text-2xl font-bold mb-10">
SubManager
</h1>

<nav className="flex flex-col gap-5">

<Link to="/" className="hover:text-gray-200">
Dashboard
</Link>

<Link to="/subscriptions" className="hover:text-gray-200">
My Subscriptions
</Link>

<Link to="/add" className="hover:text-gray-200">
Add Subscription
</Link>

<Link to="/billing" className="hover:text-gray-200">
Billing History
</Link>

<Link to="/notifications" className="hover:text-gray-200">
Notifications
</Link>

<Link to="/settings" className="hover:text-gray-200">
Settings
</Link>

<button
onClick={logout}
className="mt-10 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
>
Logout
</button>

</nav>

</div>

);

}