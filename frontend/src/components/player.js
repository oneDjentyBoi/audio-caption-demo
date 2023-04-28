import './player.css';
import React, { useState, useEffect, useRef } from "react";
import audioSrc from "./audio1.mp3";

const sampleText = {//arranged in increasing order wrt end time
    3:{
        text: "hello",
        colour:"green"
    },
    10:{
        text: "my name",
        colour:"blue"
    },
    17:{
        text: "is Aritro",
        colour:"purple"
    },
    28:{
        text: "Nice to meet you",
        colour:"red"
    },
    40:{
        text: "GoodBye!",
        colour:"black"
    }
}

const timeStamps = (time) => {// calculates start-time and end-time of a phrase
    let sampleTextArr = Object.keys(sampleText);
    let startTime = 0, endTime = 0;
    for(let i = 0; i < sampleTextArr.length; i++){
        if(parseFloat(sampleTextArr[i]) > time){
            startTime = i === 0 ? 0 : parseFloat(sampleTextArr[i-1]);
            endTime = parseFloat(sampleTextArr[i]);
            break;
        }
    }
    // console.log({startTime, endTime});
    return {
        startTime,
        endTime
    }
}

const Player = () => {
    const playerRef = useRef();
    const captionRef = useRef();
    useEffect(() => {
        const onTimeUpdate = () => {
            let time = playerRef.current.currentTime;
            let {startTime, endTime} = timeStamps(time);

            if(time > startTime && time < endTime){
                captionRef.current.innerText = sampleText[endTime].text;
                captionRef.current.style.color = sampleText[endTime].colour;
            }
            else
                captionRef.current.innerText = ''; //cleanup
        };
        playerRef.current.addEventListener("timeupdate", onTimeUpdate);
        return () => {
            playerRef.current
            .removeEventListener("timeupdate", onTimeUpdate);
        }
    }, []);
    
    return (<React.Fragment>
            <audio controls src={audioSrc} ref={playerRef} type="audio/mp3"/>
            <div ref={captionRef} className='caption-container'></div>
    </React.Fragment>
    )
}

export default Player;