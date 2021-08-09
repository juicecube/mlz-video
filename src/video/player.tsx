import React, { forwardRef, useCallback, useEffect, useReducer, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { IPlayerProps, VideoRef, VideoStatus } from './type';
import { initialState } from './content';
import { reducer } from './reducer';

import { Controller } from './component/controller';
import { Loading } from './component/loading';
import { Bezel } from './component/bezel';

import './index.scss';

export const Player = forwardRef<VideoRef, IPlayerProps>((props, ref) => {
  const { preload = 'metadata', poster, src, children, className, onDurationchange, onPlay, onPause, onTouch, progressStyle, fullscreen, ...rest } = props;
  const videoRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { status, currentTime, seekingTime, isActive } = state;

  useImperativeHandle(ref, () => ({
    apiDoPlaying: () => {
      // if (videoRef.current) {
      //   return videoRef.current.play();
      // }
      handlePlay();
    },
    apiDoPaused: () => {
      // if (videoRef.current) {
      //   return videoRef.current.pause();
      // }
      handlePause();
    },
    apiDoGetCurrent: () => videoRef.current,
  }));

  // isActive
  useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // 及时更新state里面的currentTime
  useEffect(() => {
    const timeupdateListener = () => {
      const { currentTime, buffered } = videoRef.current;

      dispatch({ type: 'modify', payload: { currentTime, buffered } });
    };

    if(videoRef.current) {
      videoRef.current.addEventListener('timeupdate', timeupdateListener);
    }

    return () => {
      if(videoRef.current){
        videoRef.current.removeEventListener('timeupdate', timeupdateListener);
      }
    };
  }, []);

  // 全屏模式下 控件常驻
  useEffect(() => {
    if (fullscreen) {
      clearTimeout(timerRef.current);

      dispatch({ type: 'modify', payload: { isActive: true } });
    } else {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        dispatch({ type: 'modify', payload: { isActive: false } });
      }, 4000);
    }
  }, [fullscreen]);

  const handlePlayerClick = useCallback(() => {
    if (!fullscreen) {
      clearTimeout(timerRef.current);

      dispatch({ type: 'modify', payload: { isActive: true } });
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'modify', payload: { isActive: false } });
      }, 3000);
    }

    if (onTouch) {
      onTouch();
      return;
    }

    state.status === VideoStatus.PLAYING ? handlePause() : handlePlay();
  }, [state.status, state.isActive, fullscreen]);

  useEffect(() => {
    // 监听 Bezel
    videoRef?.current?.addEventListener('click', handlePlayerClick);
    videoRef?.current?.addEventListener('touch', handlePlayerClick);

    return () => {
      videoRef?.current?.removeEventListener('click', handlePlayerClick);
      videoRef?.current?.removeEventListener('touch', handlePlayerClick);
    };
  }, [state.status, state.isActive]);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      dispatch({ type: 'modify', payload: { status: VideoStatus.WAITING, isActive: true } });

      const promise = videoRef.current.play();
      if (promise !== undefined) {
        // eslint-disable-next-line promise/catch-or-return
        promise.catch((e:any) => {
          dispatch({ type: 'handleError' });
          throw new Error(e);
        }).then(() => {
          dispatch({ type: 'handlePlaying' });
          onPlay && onPlay();
        });
      }
    }
  }, [state.status]);

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      dispatch({ type: 'handlePausing' });
      onPause && onPause();
    }
  }, [state.status]);

  const handleBezelPause = () => {
    if (fullscreen) {
      handlePause();
    } else {
      if (onTouch) {
        onTouch();
        return;
      }

      handlePause();
    }
  };

  const renderChildren = () => {
    if (children) return children;
    else return <p>something error</p>;
  };

  const handleLoaded = () => {
    if(videoRef.current) {
      const { duration } = videoRef.current;
      dispatch({ type: 'modify', payload: { duration } });
    }
  };

  const handleSeekingTime = (newTime:number) => {
    // 修改reducer里的seekingTime
    dispatch({ type: 'modify', payload: { seekingTime: newTime } });
  };

  const handleSeek = (newTime:number) => {
    // 修改videoRef 的 currentTime，reducer的currentTime
    if (videoRef.current) {
      // dispatch({ type: 'modify', payload: { status: VideoStatus.PAUSED } });

      videoRef.current.currentTime = newTime;
      dispatch({ type: 'modify', payload: { currentTime: newTime } });

      // setTimeout(() =>{
      //   dispatch({ type: 'modify', payload: { status: VideoStatus.PLAYING} })
      // }, 200)

      if (status === VideoStatus.PLAYING) {
        const promise = videoRef.current.play();
        if (promise !== undefined) {
          // eslint-disable-next-line promise/catch-or-return
          promise.catch((e:any) => {
            dispatch({ type: 'handleError' });
            throw new Error(e);
          }).then(() => {
            dispatch({ type: 'handlePlaying' });
          });
        }
      } else {
        videoRef.current.pause();
        dispatch({ type: 'handlePausing' });
      }
    }
  };

  const handleForward = (val:number) => {
    // 快进 val 秒
    handleSeek(currentTime + val);
    // dispatch({ type: 'modify', payload: { currentTime: currentTime + val } });
  };

  return (
    <div
      id="mlz-palyer"
      className="mlz-palyer">
      <video
        className={classNames('mlz-video', className)}
        id="mlz-video"
        ref={videoRef}
        preload={preload}
        poster={poster}
        src={src}
        x5-video-player-type="h5-page"
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="true"
        x5-playsinline="true"
        onDurationChange={(e) => {
          handleLoaded();
          onDurationchange && onDurationchange(e);
        }}
        {...rest}
      >
        {renderChildren()}
      </video>
      { status === VideoStatus.WAITING ? <Loading /> : null }
      <Bezel
        onPlay={handlePlay}
        onPause={handleBezelPause}
        // onTouch={handlePlayerClick}
        state={state}
      />
      <Controller
        onSeekingTime={handleSeekingTime}
        onSeek={handleSeek}
        state={state}
        onForward={handleForward}
        onPlay={handlePlay}
        onPause={handlePause}
        progressStyle={progressStyle}
      />
    </div>
  );

});

Player.displayName = 'Player';
