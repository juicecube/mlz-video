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
  const { preload = 'metadata', poster, src, children, className, onDurationchange, onPlay, onPause, onTouch, progressStyle, fullscreen, hasSystemFullscreen = false, onSystemFullscreen, ...rest } = props;
  const videoRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { status, currentTime } = state;

  // 暴露的api
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
  // 判断播放到最后的时候，结束视频播放，且进度条回到初始值
  useEffect(() => {
    const timeupdateListener = () => {
      const { currentTime, buffered, duration } = videoRef.current;

      dispatch({ type: 'modify', payload: { currentTime, buffered } });

      // 播放到最后，结束播放
      if (currentTime === duration) {
        setTimeout(() => {
          handlePause();
          dispatch({ type: 'modify', payload: { currentTime: 0 } });
        }, 0);
      }
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

  // 恢复播放/暂停状态
  const recover = () => {
    clearTimeout(timerRef.current);

    if (videoRef.current) {
      if (state.status === VideoStatus.PLAYING) {
        dispatch({ type: 'modify', payload: { status: VideoStatus.PLAYING, isActive: true } });
        videoRef.current.play();
      } else {
        dispatch({ type: 'modify', payload: { status: VideoStatus.PAUSED, isActive: true } });
        videoRef.current.pause();
      }

      timerRef.current = setTimeout(() => {
        dispatch({ type: 'modify', payload: { isActive: false } });
      }, 4000);
    }
  };

  /**
   * 监听系统全屏
   */
  useEffect(() => {
    if (hasSystemFullscreen) {
      const handleFullScreenChange = () => {
        if(document.fullscreenElement === null) {
          // 退出全屏时，播放/暂停 状态恢复
          recover();

          onSystemFullscreen && onSystemFullscreen();
        }
      };

      videoRef.current.addEventListener('fullscreenchange', handleFullScreenChange, false);
      videoRef.current.addEventListener('mozfullscreenchange', handleFullScreenChange, false);
      videoRef.current.addEventListener('webkitfullscreenchange', handleFullScreenChange, false);
      videoRef.current.addEventListener('msfullscreenchange', handleFullScreenChange, false);

      return () => {
        videoRef.current.removeEventListener('fullscreenchange', handleFullScreenChange);
        videoRef.current.removeEventListener('mozfullscreenchange', handleFullScreenChange);
        videoRef.current.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
        videoRef.current.removeEventListener('msfullscreenchange', handleFullScreenChange);
      };
    }

    return;
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
      // 已经播放了，seekingTime 重置
      dispatch({ type: 'modify', payload: { currentTime: newTime, seekingTime: 0 } });

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

  // 进入全屏模式，不归组件方管，系统video全屏播放怎么样就怎么样。
  const handleSystemFullscreen = () => {
    let promise;
    if (videoRef.current) {
      if(videoRef.current.requestFullscreen){
        promise = videoRef.current.requestFullscreen();
      }else if(videoRef.current.webkitRequestFullScreen){
        promise = videoRef.current.webkitRequestFullScreen();
      }else if(videoRef.current.mozRequestFullScreen){
        promise = videoRef.current.mozRequestFullScreen();
      }else if (videoRef.current.webkitEnterFullscreen){
        // iOS进入全屏
        promise = videoRef.current.webkitEnterFullscreen();

        // 针对iOS监听不到webkitfullscreenchange事件做的兼容，感知退出全屏
        const timer = setInterval(() => {
          if (!videoRef.current.webkitDisplayingFullscreen) {
            // 没办法，恶心的逻辑只能写在这里  退出了全屏
            // 退出全屏时，播放/暂停 状态恢复
            recover();

            onSystemFullscreen && onSystemFullscreen();

            clearInterval(timer);
          }
        }, 1000);
      } else {
        promise = videoRef.current.msRequestFullscreen();
      }
    }

    if (promise !== undefined) {
      // eslint-disable-next-line promise/catch-or-return
      promise.catch((e:any) => {
        dispatch({ type: 'handleError' });
        throw new Error(e);
      }).then(() => {
        onSystemFullscreen && onSystemFullscreen();
      });
    }
  };

  // 进度条的ui，主要是控制进度条长度
  // 如果是在swiper里，pagination和视频的controller同层级：非全屏模式下，swiper的pagination 占一定宽度；全屏模式下，swiper在最底下，和视频的controller不同层级
  // 如果不是在swiper里，且需要开启系统自带全屏，则宽度需要计算是否减去「是否全屏」按钮
  const _progressStyle = progressStyle ? progressStyle : ( hasSystemFullscreen ? { width: '201px' } : {} );

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
        progressStyle={_progressStyle}
        hasSystemFullscreen={hasSystemFullscreen}
        onSystemFullscreen={handleSystemFullscreen}
      />
    </div>
  );

});

Player.displayName = 'Player';
