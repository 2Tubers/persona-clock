import React, { useState , useEffect } from 'react';

function Background(){
    var [color ,setColor]=React.useState('dark');

    function handleClick(){
         setColor(
            color === 'dark' ? 'light' : 'dark'
         );
    }
  
    useEffect(() => {
        if (color === 'dark') {
            document.body.classList.remove('bright');
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('bright');
        }
    }, [color]); // Run this effect whenever the color state changes

    return (

    
    <div>
     <button onClick={handleClick}><img src={color === 'dark' ? "/icons/sun.webp" : "/icons/moon.png"} alt={color === 'dark' ? "Moon" : "Sun"} className='mode' /></button>
</div>
);
}

export default Background;