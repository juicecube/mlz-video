import React, { FC } from 'react';
import '../index.scss';

import { ControllerProps, VideoStatus } from '../type';
import playingSvg from '../assets/playing.svg';
import pausedSvg from '../assets/paused.svg';
import { Progress } from './progress';
import { Timer } from './timer';
import { SystemFullscreen } from './systemFullscreen';

export const Controller:FC<ControllerProps> = ({ state, onPlay, onPause, onSeekingTime, onSeek, onForward, progressStyle, hasSystemFullscreen, onSystemFullscreen }) => {
  const handlePlay = () => {
    onPlay && onPlay();
  };

  const handlePuase = () => {
    onPause && onPause();
  };

  const handleSeekingTime = (newTime:number) => {
    // 修改reducer里的seekingTime
    onSeekingTime && onSeekingTime(newTime);
  };

  const handleSeek = (newTime:number) => {
    // 修改videoRef 的 currentTime，reducer的currentTime
    onSeek && onSeek(newTime);
  };

  const handleForward = (val:number) => {
    // 快进 val 秒
    onForward && onForward(val);
  };

  const handleSystemFullscreen = () => {
    // 控制系统全屏
    onSystemFullscreen && onSystemFullscreen();
  };

  const renderBtn = () => {
    if (state.status === VideoStatus.PLAYING) {
      return (
        <button
          onClick={handlePuase}
          className="mlz-controller-paused">
          <img
            src={pausedSvg}
            alt=""/>
        </button>
      );
    } else {
      return (
        <button
          onClick={handlePlay}
          className="mlz-controller-playing">
          <img
            src={playingSvg}
            alt=""/>
        </button>
      );
    }
  };

  const style = state.isActive ? {} : { display: 'none' };

  return (
    <div
      id="mlz-controller"
      className="mlz-controller"
      style={style}
    >
      {renderBtn()}
      <Progress
        onSeekingTime={handleSeekingTime}
        onSeek={handleSeek}
        state={state}
        onForward={handleForward}
        progressStyle={progressStyle}
      />
      <Timer state={state} />
      {hasSystemFullscreen ? <SystemFullscreen
        onSystemFullscreen={handleSystemFullscreen} /> : null}
    </div>
  );
};
