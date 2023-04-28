import './player.css';
import React, { useState, useEffect, useRef } from "react";
import audioSrc from "./audio1.mp3";

const sampleText = {//arranged in increasing order wrt end time
    3:{
        text: "Hello,",
        colour:"green"
    },
    10:{
        text: "my name",
        colour:"blue"
    },
    17:{
        text: "is Aritro.",
        colour:"purple"
    },
    28:{
        text: "Nice to meet you.",
        colour:"red"
    },
    40:{
        text: "GoodBye!",
        colour:"black"
    }
}

const sampleTextArr = Object.keys(sampleText);

const timeStamps = (time) => {// calculates start-time and end-time of a phrase
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
        const clearBg = (idx) => {
            captionRef.current.childNodes[idx].style.backgroundColor = 'transparent';
        }
        const onTimeUpdate = () => {
            let time = playerRef.current.currentTime;
            let {startTime, endTime} = timeStamps(time);
            var spanIdx = 0;
            if(time > startTime && time < endTime){
                spanIdx = sampleTextArr.findIndex( txt => String(endTime) === txt );
                if(spanIdx && spanIdx !== -1)
                    clearBg(spanIdx - 1);
                if(spanIdx !== -1){
                    captionRef.current.childNodes[spanIdx].style.backgroundColor = sampleText[endTime].colour;
                    if(spanIdx + 1 < captionRef.current.childNodes.length){
                        clearBg(spanIdx + 1);
                    }
                }
            }
            if(time > String(sampleTextArr[sampleTextArr.length - 1]))
                clearBg(sampleTextArr.length - 1);
        };
        const seekerFunc = () => {
            captionRef.current.childNodes.forEach(childNode => {
                childNode.style.backgroundColor = 'transparent';           
            });
        }
        playerRef.current.addEventListener("timeupdate", onTimeUpdate);
        playerRef.current.addEventListener("seeking", seekerFunc);
        return () => {
            playerRef.current
            .removeEventListener("timeupdate", onTimeUpdate);
            playerRef.current
            .removeEventListener("seeking",seekerFunc);
        }
    }, []);
    
    return (<React.Fragment>
            <audio controls src={audioSrc} ref={playerRef} type="audio/mp3"/>
            <div ref={captionRef} className='caption-container'>
                { sampleTextArr.map((wordKey, i) => <span key={`${wordKey}-${i}`}>{sampleText[wordKey].text.trim()} </span>) }
            </div>
    </React.Fragment>
    )
}

export default Player;