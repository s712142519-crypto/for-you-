
import React from 'react';
import { PhotoData, MessageData } from './types';

/* 
================================================================================
   FILE PATH CONFIGURATION
   1. Create a folder named 'videos' next to index.html
   2. Save your Naruto video as 'birthday_video.mp4' inside that folder.
================================================================================
*/

// Your Local Video Path:
export const VIDEO_PATH = '/videos/birthday_video.mp4';

// Your Secret Mirror Photos (Used in the messages section):
export const MIRROR_PHOTOS: PhotoData[] = [
  { id: 201, url: 'images/mirror 1.png', caption: 'I will Never ignore you' },
  { id: 202, url: 'images/mirror 2.png', caption: ' I will Comfort you' },
  { id: 203, url: 'images/mirror 3.png', caption: ' I will Take care of you' },
  { id: 204, url: 'images/mirror 4.png', caption: 'I Always Respect you' },
  { id: 205, url: 'images/mirror 5.png', caption: 'I Always listen to you' },
];



/* 
================================================================================
   BIRTHDAY MESSAGES
================================================================================
*/
export const MESSAGES: MessageData[] = [
 { id: 1, title: 'I will Never ignore you', content: "I don't ignore you in my life you'r my second priority🤗  .", color: 'pink' },
  { id: 2, title: 'I will Comfort you ', content: "When ever you feel dull or mood swings i am here to comfort you❤️  .", color: 'purple' },
  { id: 3, title: 'I will Take care of you', content: "I always take care of you as a family member🥰 .", color: 'pink' },
  { id: 4, title: 'I will Always Respect you', content: "I always Respect you like my family Member😊.", color: 'purple' },
  { id: 5, title: 'I will Always listen to you', content: "I always listen to you no matter what i always listenn to you💖!", color: 'pink' },
];

export const PHOTOS: PhotoData[] = [];

export const RoseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 20c-10 0-15 10-15 10s-5-10-15-10c-10 0-15 10-10 20s20 30 40 40c20-10 45-30 45-40s0-20-15-20c-10 0-15 10-15 10s-5-10-15-10z" />
    <path d="M50 90c0-10-5-20-15-30" stroke="green" strokeWidth="2" fill="none" />
  </svg>
);
