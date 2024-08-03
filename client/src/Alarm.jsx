import React, { useEffect,useState } from "react";
import CreateAlarm from "./CreateAlarm";
import Content from "./Content";
import axios from 'axios';

function Alarm() {
  const [alarms,setAlarms]=useState([]);
  const[click,setClick]=useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);

    function mainData(props){
       setAlarms((prev) => [props,...prev]);
    }

    function deleteAlarms(id){
      setAlarms(function (prev){
        return prev.filter(function (alarm,index){
          return index!==id;
        });
      });
    }

    function handleClick(){
      setClick(!click);
    }

    async function getSong(name){
      const response= await axios.post('https://clock-backend-4.onrender.com', {name});
      return response;
    }

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const currentHrs = now.getHours();
        let currentMins = now.getMinutes();
        alarms.forEach(async (alarm,id) => {
          
          if (alarm.set && alarm.hrs == currentHrs && alarm.min== currentMins) {

            let playback= await getSong(alarm.song);
            if(playback.data==null){
              playback.data="/audio/aud1.mp3";
            }
            console.log(playback.data);
            const audio = new Audio(playback.data);
          audio.play();
          }
        });
      }, 60000);
    }, [alarms]);
  

  return (
    <div >
      <div className="alarm">
        <p> Add Alarm </p>
        <button className="plus" onClick={handleClick}>+</button>
       { click && <CreateAlarm handler={mainData} handleClicker={handleClick} setFaceMatcher={setFaceMatcher}/>}
     
       {alarms.map((item,index)=>{
        
        return(
          <Content hrs={item.hrs}
                   min={item.min}
                   song={item.song}
                   del={deleteAlarms}
                   key={index}
                   id={index}
                   faceMatcher={faceMatcher}
          />)
    
       })}


     
        </div>
    
  
        
      
    </div>
  );
}

export default Alarm;
