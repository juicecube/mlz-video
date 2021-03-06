import React, { useRef, useState, useEffect } from 'react';
import { Player } from '../src/index';
import './test.scss';

// test postinstall会先设置libraryname
// import { Player } from '../dist/rs/mlz-video';
// import { Player } from '../dist/lib/mlz-video';
// import { Player } from '../dist/types';

export const Test = () => {
  const videoRef0 = useRef<any>(null);
  const videoRef1 = useRef<any>(null);
  const videoRef2 = useRef<any>(null);
  const videoUrl = 'https://online-education.codemao.cn/444/162142647511721.mp4';
  const videoImgUrl = `${videoUrl}?vframe/jpg/offset/1/w/750/h/562`;

  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [state, setState] = useState<number>(0);

  const handleVideoonPause = () => {
    console.log('handleVideoonPause');
  };

  const handleVideoPlay = () => {
    console.log('handleVideoPlay');
  };

  const handleVideoTouch = () => {
    console.log('handleVideoTouch');
    setFullscreen(true);
  };

  const handleSystemFullscreen = () => {
    console.log('调用方 handleSystemFullscreen');
    setState(state + 1);
  };

  console.log('render', Player);

  return (
    <div className="test">
      <p>基本型</p>
      <Player
        ref={videoRef0}
        src={videoUrl}
        poster={videoImgUrl}
      />

      <p>轮播图里的video 全屏是假的全屏</p>
      <Player
        ref={videoRef1}
        src={videoUrl}
        onPause={handleVideoonPause}
        onPlay={handleVideoPlay}
        poster={videoImgUrl}
        onTouch={handleVideoTouch}
        hasPagination={!fullscreen}
        fullscreen={fullscreen}
      />

      <p>系统全屏</p>
      <Player
        className="back"
        ref={videoRef2}
        src={videoUrl}
        onPause={handleVideoonPause}
        onPlay={handleVideoPlay}
        poster={videoImgUrl}
        onTouch={handleVideoTouch}
        hasSystemFullscreen
        onSystemFullscreen={handleSystemFullscreen}
      />
      <p>{state}</p>
    </div>
  );
};


