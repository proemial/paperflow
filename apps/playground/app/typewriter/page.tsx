"use client";
import React from 'react'
import { TypeAnimation } from 'react-type-animation';

export default function TypewriterPage() {
  // @ts-ignore
  return (
    <TypeAnimation
      sequence={[
        '#SmartCities: AutoSTL is the first automated spatio-temporal multi-task learning mezhod, ',
        1000, // Waits 1s
        '#SmartCities: AutoSTL is the first automated spatio-temporal multi-task learning method, ',
        1000, // Waits 1s
        '#SmartCities: AutoSTL is the first automated spatio-temporal multi-task learning method, helping to promote intelligent city life by jointly modeling multiple spatio-temporal taskz. ',
        1000, // Waits 1s
        '#SmartCities: AutoSTL is the first automated spatio-temporal multi-task learning method, helping to promote intelligent city life by jointly modeling multiple spatio-temporal tasks. ',
        // 'Two', // Deletes 'One' and types 'Two'
        // 2000, // Waits 2s
        // 'Two Three', // Types 'Three' without deleting 'Two'
        () => {
          console.log('Sequence completed'); // Place optional callbacks anywhere in the array
        }
      ]}
      wrapper="span"
      cursor={true}
      // repeat={Infinity}
      style={{ fontSize: '2em', display: 'inline-block' }}
      speed={22}
      deletionSpeed={66}
    />
  )
}