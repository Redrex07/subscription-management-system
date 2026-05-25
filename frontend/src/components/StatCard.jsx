export default function StatCard({title,value,color}){

return(

<div className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center">

<div>
<p className="text-gray-500">{title}</p>
<h2 className="text-2xl font-bold">{value}</h2>
</div>

<div className={`w-12 h-12 rounded-full ${color}`}></div>

</div>

)
}