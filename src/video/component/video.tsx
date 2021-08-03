import React, { forwardRef, useImperativeHandle, useRef, ForwardedRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { IVideoProps, VideoRef, VideoStatus } from '../type';
import '../index.scss';

export const Video = forwardRef<VideoRef | ForwardedRef<HTMLVideoElement>, IVideoProps>((props, ref) => {
  const { className, preload = 'metadata', poster, src, children, status, onPlay, onPause, ...rest } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  const renderChildren = () => {
    if (children) return children;
    else return <p>something error</p>;
  };

  useImperativeHandle(ref, () => ({
    apiDoPlaying: () => {
      if (videoRef.current) {
        return videoRef.current.play();
      }
    },
    apiDoPaused: () => {
      if (videoRef.current) {
        return videoRef.current.pause();
      }
    },
    apiGetVideoRef: () => videoRef,
  }));

  const handlePlayerClick = useCallback(() => {
    status === VideoStatus.PLAYING ? onPlay() : onPause();
  }, []);

  useEffect(() => {
    // 监听 Bezel
    document.addEventListener('click', handlePlayerClick);
    document.addEventListener('touch', handlePlayerClick);

    return () => {
      document.removeEventListener('click', handlePlayerClick);
      document.removeEventListener('touch', handlePlayerClick);
    };
  }, []);

  return (
    <video
      className={classNames('mlz-video', className)}
      id="mlz-video"
      ref={videoRef}
      preload={preload}
      poster={poster}
      src={src}
      {...rest}
    >
      {renderChildren()}
    </video>
  );
});

Video.displayName = 'Video';
