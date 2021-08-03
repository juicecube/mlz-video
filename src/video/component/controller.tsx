import React, { FC } from 'react';
import '../index.scss';

import { ControllerProps, VideoStatus } from '../type';
import { Progress } from './progress';
import { Timer } from './timer';


export const Controller:FC<ControllerProps> = ({ state, onPlay, onPause, onSeekingTime, onSeek, onForward, progressStyle }) => {
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

  const renderBtn = () => {
    if (state.status === VideoStatus.PLAYING) return (
      <button
        onClick={handlePuase}
        className="mlz-controller-paused" />
    );
    else return (
      <button
        onClick={handlePlay}
        className="mlz-controller-playing"/>
    );
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
    </div>
  );
};
