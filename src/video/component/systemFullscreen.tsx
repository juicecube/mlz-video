import React, { FC } from 'react';

import '../index.scss';

import fullScreenSvg from '../assets/fullscreen.svg';

import { SystemFullscreenProps } from '../type';

// 用系统自带的全屏，不管ui，不管交互，所以只需要非全屏时，有个点击全屏按钮
export const SystemFullscreen:FC<SystemFullscreenProps> = ({ onSystemFullscreen }) => {
  const handleScreen = () => {
    console.log('组件 handleScreen');
    onSystemFullscreen && onSystemFullscreen();
  };

  return (
    <div
      className="mlz-controller-systme-fullscreen"
      onClick={handleScreen}>
      <img
        src={fullScreenSvg}
        alt=""/>
    </div>
  );
};
