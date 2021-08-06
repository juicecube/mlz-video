import React, { useState, useRef, FC, useEffect } from 'react';

import '../index.scss';

import playingSvg from '../assets/playing.svg';
import pausedSvg from '../assets/paused.svg';

import { BezelProps, VideoStatus } from '../type';

export const Bezel:FC<BezelProps> = ({ state: { status }, onPause, onPlay }) => {
  const [show, setShow] = useState(true);

  const timer = useRef<any>(null);

  useEffect(() => () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  const handlePlay = () => {
    clearTimeout(timer.current);

    setShow(false);
    onPlay && onPlay();

    timer.current = setTimeout(() => {
      setShow(true);
    }, 1000);
  };

  const handlePuase = () => {
    // clearTimeout(timer.current);

    // setShow(false);
    onPause && onPause();

    // timer.current = setTimeout(() => {
    //   setShow(true);
    // }, 3000);
  };

  const style = show ? {} : { display: 'none' };

  // 任何播放时候，一个左下角的暂停按钮就好
  // WAITING 的时候有loading，不要重叠
  if (status === VideoStatus.PLAYING || status === VideoStatus.WAITING) {
    // return (
    //   <div
    //     className="mlz-bezel mlz-bezel-animation-alt"
    //     role="status"
    //     aria-label={status}
    //     style={style}
    //   >
    //     <div
    //       onClick={handlePuase}
    //       className="mlz-bezel-icon mlz-bezel-icon-paused" >
    //       <img
    //         src={pausedSvg}
    //         alt=""/>
    //     </div>
    //   </div>
    // );
    return null;
  }

  return (
    <div
      className="mlz-bezel mlz-bezel-animation-alt"
      role="status"
      aria-label={status}
      style={style}
    >
      <div
        onClick={handlePlay}
        className="mlz-bezel-icon mlz-bezel-icon-playing" >
        <img
          src={playingSvg}
          alt="playingSvg"/>
      </div>
    </div>
  );
};
