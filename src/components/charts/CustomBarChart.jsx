import React from 'react'
import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,Cell } from 'recharts'

const CustomBarChart = ({data}) => {

    // function to alternate colrs
    const getBarColor = (entry) => {
        switch(entry?.priority){
             case 'low':
                return '#00BC7D';
            case 'medium':
                return '#FE9900';
                case 'high':
                return '#FF1F57';
            default:
                return '#00BC7D'; // default color
        }
    }
    const Customtooltip=({active,payload})=>{
        if(active && payload && payload.length){
            return(
                <div className='bg-white p-2 rounded-lg shadow-md border border-gray-300'>
                    <p className='text-xs  font-semibold text-purple-800 mb-1'>{payload[0].payload.priority}</p>
                    <p className='text-sm font-medium text-gray-900'>{payload[0].payload.count}</p>
                </div>
            )
        }
        return null;
    }

  return (
   <div className='bg-white mt-6'>

    <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
            
            <CartesianGrid stroke='none' />
            <XAxis dataKey='priority' tick={{fontSize:12,fill:"#555"}} stroke='none' />
            <YAxis tick={{fontSize:12,fill:"#555"}} stroke='none'  />
            <Tooltip content={<Customtooltip />} cursor={{fill:'transparent'}} />
    
    <Bar dataKey='count' nameKey="priority" fill='#FF8042' radius={[10, 10, 0, 0]} activeDot={{r:8,fill:"yellow"}} activeStyle={{fill:"green"}} >
                {data.map((entry,index)=>(
                    <Cell key={index} fill={getBarColor(entry)} />
                ))}
            </Bar>
            <Legend verticalAlign='top' align='right' iconType='circle' iconSize={8} wrapperStyle={{padding:10}} />
        </BarChart>
    </ResponsiveContainer>
   </div>
  )
}

export default CustomBarChart