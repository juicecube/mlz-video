import React, { useState, useRef, FC, useEffect } from 'react';

import '../index.scss';
// import classNames from 'classnames';

import { BezelProps, VideoStatus } from '../type';

export const Bezel:FC<BezelProps> = ({ state: { status, isActive }, onPause, onPlay }) => {
  // const [show, setShow] = useState(false);

  // const timer = useRef<any>(null);

  // useEffect(() => () => {
  //   if (timer.current) {
  //     clearTimeout(timer.current);
  //   }
  // }, []);

  const handlePlay = () => {
    // clearTimeout(timer.current);

    // setShow(false);
    onPlay && onPlay();

    // timer.current = setTimeout(() => {
    //   setShow(true);
    // }, 3000);
  };

  const handlePuase = () => {
    // clearTimeout(timer.current);

    // setShow(false);
    onPause && onPause();

    // timer.current = setTimeout(() => {
    //   setShow(true);
    // }, 3000);
  };

  const style = isActive ? {} : { display: 'none' };

  if (status === VideoStatus.PLAYING) {
    return (
      <div
        className="mlz-bezel mlz-bezel-animation-alt"
        role="status"
        aria-label={status}
        style={style}
      >
        <div
          onClick={handlePuase}
          className="mlz-bezel-icon mlz-bezel-icon-paused" />
      </div>
    );
  }

  return (
    <div
      // bezel 的动效
      // className={classNames(
      //   'mlz-bezel',
      //   {
      //     'mlz-bezel-animation-alt': click,
      //   },
      // )}
      className="mlz-bezel mlz-bezel-animation-alt"
      role="status"
      aria-label={status}
      style={style}
    >
      <div
        onClick={handlePlay}
        className="mlz-bezel-icon mlz-bezel-icon-playing" />
    </div>
  );
};
