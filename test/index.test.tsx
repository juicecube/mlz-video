import React, { useRef, useState } from 'react';
// import { Player } from '../src/index';
import './test.scss';

// test postinstall会先设置libraryname
// import { Player } from '../dist/lib/mlz-video';
import { Player } from '../dist/lib/mlz-video';
// import { Player } from '../dist/es/mlz-video';
// import { Player } from '../dist/types';

// export const Test = () => {
//   const videoRef = useRef<any>(null);
//   const videoUrl = 'https://online-education.codemao.cn/444/162142647511721.mp4';
//   const videoImgUrl = `${videoUrl}?vframe/jpg/offset/1/w/750/h/562`;

//   const [fullscreen, setFullscreen] = useState<boolean>(false);

//   const handleVideoonPause = () => {
//     console.log('handleVideoonPause');
//   };

//   const handleVideoPlay = () => {
//     console.log('handleVideoPlay');
//   };

//   const handleVideoTouch = () => {
//     console.log('handleVideoTouch');
//   };

//   // 非全屏下 进度条的长度需减去swiper的navigation
//   const progressStyle = {
//     width: 'calc(100% - 24px - 16px - 16px - 70px - 16px - 20px)',
//   };

//   console.log('render', Player);

//   return (
//     <div className="test">
//       <Player
//         ref={videoRef}
//         src={videoUrl}
//         onPause={handleVideoonPause}
//         onPlay={handleVideoPlay}
//         poster={videoImgUrl}
//         onTouch={handleVideoTouch}
//         progressStyle={fullscreen ? {} : progressStyle}
//         fullscreen={fullscreen}
//       />
//     </div>
//   );
// };


export const Test = () => <div><Player /> Test</div>;

