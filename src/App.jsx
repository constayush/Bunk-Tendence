import {React, useState} from 'react'

function App() {

let [current, setCurrent] =useState(0)
let [total, setTotal] =useState(0)


 function handleCurrentChange(){


 }

 function handleTotalChange(){


 }


  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
    
    
    
    
    
    <h1 className='text-[3rem]'>Bunktendence!</h1>
    <h3 className='text-[]'>calculate how many lactures you can bunk</h3>
    
    
    <input onChange={handleCurrentChange} value={current} className='currentLac mt-[2rem] bg-[#666363] text-[1.3rem] text-white' type='number'></input>
    <input onChange={handleTotalChange}   value={total} className='totalLac   mt-[2rem] bg-[#666363] text-[1.3rem] text-white' type='number'></input>
    
    
    
    
    
    
    
    </div>
  )
}

export default App