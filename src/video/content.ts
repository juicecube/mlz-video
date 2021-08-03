import { VideoStatus, InitialStateProps } from './type';

export const initialState:InitialStateProps = {
  status: VideoStatus.PAUSED,
  currentTime: 0, // 当前时间
  seekingTime: 0, // 想要播放的时间
  isActive: true, // 是否显示控件
  fullscreen: false, // 是否全屏
  duration: 0, // 秒为单位的视频长度
  buffered: {
    length: 1,
    start() {},
    end() {},
  },
};
