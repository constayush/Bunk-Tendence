import {React, useState} from 'react'

function App() {

let [current, setCurrent] =useState(0)
let [total, setTotal] =useState(0)
let [displayText, setDisplayText] =useState(0)
let [req, setReq] =useState(0)
let [bunk, setBunk] =useState(0)
let [percentageReq, setPercentageReq] =useState(0)
 function handleCurrentChange(e){

setCurrent(e.target.value)

 }

 function handleTotalChange(e){
  setTotal(e.target.value)

 }
function handleResultClick(){
setPercentageReq(75)
if(total <= 0){ setDisplayText("theek no daalo bhai")}
if(total < 0){

  let percent = (current/total)*100

if(percent >75){
  setBunk (Math.floor((100 * present - percentageReq * total) / percentageReq))
  setDisplayText(`you can bunk ${bunk} class more`)
}
if(percent < 75){ 

 setReq ( Math.ceil((percentageReq * total - 100 * present) / (100 - percentageReq)))
setDisplayText(`you have to attend ${req} class more`)
}
}


}

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
    
    
    
    
    
    <h1 className='text-[3rem]'>Bunktendence!</h1>
    <h3 className='text-[]'>calculate how many lactures you can bunk</h3>
    
    
    <input onChange={handleCurrentChange}  className='currentLac mt-[2rem] bg-[#666363] text-[1.3rem] text-white' type='number'></input>
    <input onChange={handleTotalChange}   className='totalLac   mt-[2rem] bg-[#666363] text-[1.3rem] text-white' type='number'></input>
    

    <button className='w-[200px] h-[1rem] bg-red-200' onClick={handleResultClick}></button>
    <h3 className='result'> {displayText}</h3>
    
    
    
    
    
    </div>
  )
}

export default App