import React, { useRef, useState } from 'react';
import { Player } from '../src/index';
import './test.scss';

const Test = () => {
  const videoRef = useRef<any>(null);
  const videoUrl = 'https://online-education.codemao.cn/444/162142647511721.mp4';
  const videoImgUrl = `${videoUrl}?vframe/jpg/offset/1/w/750/h/562`;

  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const handleVideoonPause = () => {

  };

  const handleVideoPlay = () => {

  };

  const handleVideoTouch = () => {

  };

  // 非全屏下 进度条的长度需减去swiper的navigation
  const progressStyle = {
    width: 'calc(100% - 24px - 16px - 16px - 70px - 16px - 20px)',
  };

  return (
    <div className="test">
      <Player
        ref={videoRef}
        src={videoUrl}
        onPause={handleVideoonPause}
        onPlay={handleVideoPlay}
        poster={videoImgUrl}
        onTouch={handleVideoTouch}
        progressStyle={fullscreen ? {} : progressStyle}
        fullscreen={fullscreen}
      />
    </div>
  );
};


