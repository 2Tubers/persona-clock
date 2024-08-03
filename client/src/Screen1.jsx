import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
function Screen1() {
  var [content, setContent] = React.useState("Hi User");

  var [hidden, setHidden] = React.useState(true);

  setTimeout(() => {
    var element = document.getElementsByClassName("change");
    var classy = document.getElementsByClassName("screen");
    if(classy[0]){
    classy[0].style.height = "50vh";
    classy[0].style.alignItems = "flex-start";
    }
    setHidden(false);
    setContent(`What's in Your Mind`);
  }, 3000);

  return (
    <div className="screen_bg">
      <div className="screen">
        <p>{content}</p>
      </div>
      <div className="options">
        <Link to="/alarm">
          <button
            className="alarm_img"
            style={{ display: hidden ? "none" : "block" }}
          >
            <img src="/icons/alarm.jpeg" />
          </button>
        </Link>
        <button
          className="stopwatch_img"
          style={{ display: hidden ? "none" : "block" }}
        >
          <img src="/icons/stopwatch.jpeg" />
        </button>
      </div>
      <Outlet />
    </div>
  );
}

export default Screen1;
