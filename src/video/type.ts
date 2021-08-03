import { SyntheticEvent, CSSProperties } from 'react';

// 播放器状态
export enum VideoStatus {
    WAITING = 'waiting',
    PLAYING = 'playing',
    ERROR = 'error',
    PAUSED = 'paused',
}

type Fun = (e:SyntheticEvent) => void;

export interface InitialStateProps {
    status:VideoStatus;
    currentTime:number;
    seekingTime:number;
    isActive:boolean;
    fullscreen:boolean;
    duration:number;
    buffered:any;
}

export interface ActionProps {
    type:string;
    preload?:any;
}

export interface IVideoProps {
    poster:string; // 视频封面
    src?:string; // 视频连接 有source则不需要
    className?:string;
    preload?:string;
    // children?:HTMLSourceElement;
    children?:any;
    status:VideoStatus;
    onPlay:() => void;
    onPause:() => void;
}

export interface VideoRef {
    apiDoPlaying:(value:any) => void;
}
export interface IPlayerProps {
    poster:string; // 视频封面
    src?:string; // 视频连接 有source则不需要
    className?:string;
    preload?:string;
    // children?:HTMLSourceElement;
    children?:any;
    onDurationchange?:Fun;
    onPause?:() => void;
    onPlay?:() => void;
    onTouch?:() => void;
    progressStyle?:CSSProperties; // 进度条样式
    fullscreen?:boolean; // 全屏
}

export interface ControllerProps {
    state:InitialStateProps;
    onPlay:() => void;
    onPause:() => void;
    onSeekingTime:(newTime:number) => void;
    onSeek:(newTime:number) => void;
    onForward:(val:number) => void;
    progressStyle?:CSSProperties;
}

export interface ProgressProps {
    state:InitialStateProps;
    onSeekingTime:(newTime:number) => void;
    onSeek:(newTime:number) => void;
    onForward:(val:number) => void;
    progressStyle?:CSSProperties;
}
export interface SliderProps {
    valuenow:string;
    valuetext:string;
    getPercent:() => number;
    children:any;
    onMouseMove:(event:any) => void;
    onMouseDown?:(event:any) => void;
    onMouseUp:(event:any) => void;
    onSliderInactive?:(event:any) => void;
    onSliderActive?:(event:any) => void;
    onStepForward:() => void;
    onStepBack:() => void;
    onFocus?:(event:any) => void;
    onBlur?:(event:any) => void;
    onClick?:(event:any) => void;
}

export interface BezelProps {
    state:InitialStateProps;
    onPlay?:() => void;
    onPause?:() => void;
    // onTouch:() => void;
}
