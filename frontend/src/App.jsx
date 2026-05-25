import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddSubscription from "./pages/AddSubscription";
import Subscriptions from "./pages/Subscriptions";
import BillingHistory from "./pages/BillingHistory";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sidebar from "./components/Sidebar";
function App() {
const user = localStorage.getItem("user_id");
return (
<Router>
{user ? (
<div className="flex">
<Sidebar /><div className="flex-1">
<Routes>
<Route path="/" element={<Dashboard />} />
<Route path="/subscriptions" element={<Subscriptions />} />
<Route path="/add" element={<AddSubscription />} />
<Route path="/billing" element={<BillingHistory />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/settings" element={<Settings />} />
<Route path="*" element={<Navigate to="/" />} />
</Routes></div></div>
) : (
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="*" element={<Navigate to="/login" />} />
</Routes>
)}</Router>);}
export default App;





