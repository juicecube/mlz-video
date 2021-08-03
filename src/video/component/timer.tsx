import React, { FC } from 'react';
import '../index.scss';

import { InitialStateProps } from '../type';
import { formatTime } from '../utils';

export const Timer:FC<{ state:InitialStateProps }> = ({ state: { currentTime, duration } }) => <div className="mlz-controller-timer">
  {formatTime(currentTime)} / {formatTime(duration)}
</div>;
