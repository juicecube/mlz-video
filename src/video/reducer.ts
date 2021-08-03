import { InitialStateProps, VideoStatus } from './type';

export function reducer(state:InitialStateProps, action:any):InitialStateProps {
  switch (action.type) {
    case 'handlePlaying': {
      return { ...state, status: VideoStatus.PLAYING };
    }
    case 'handlePausing': {
      return { ...state, status: VideoStatus.PAUSED };
    }
    case 'handleError': {
      return { ...state, status: VideoStatus.WAITING };
    }
    case 'modify': {
      return { ...state, ...action.payload };
    }
    default:
      throw new Error();
  }
}
