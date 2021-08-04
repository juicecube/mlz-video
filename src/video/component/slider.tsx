import React, { useState, useEffect, forwardRef, Ref } from 'react';

import { SliderProps } from '../type';
import '../index.scss';

export const Slider = forwardRef((
  {
    valuenow,
    valuetext,
    getPercent,
    children,
    onMouseMove,
    onMouseDown,
    onSliderActive,
    onStepForward,
    onStepBack,
    onFocus,
    onBlur,
    onMouseUp,
    onSliderInactive,
    onClick,
  }:SliderProps,
  ref:Ref<HTMLDivElement>
) => {
  const [ active, setActive ] = useState(false);

  useEffect(() => () => {
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('touchmove', handleMouseMove, true);
    document.removeEventListener('touchend', handleMouseUp, true);
    document.removeEventListener('keydown', handleKeyPress, true);
  }, []);

  const handleMouseMove = (event:any) => {
    if (onMouseMove) {
      onMouseMove(event);
    }
  };

  const handleMouseUp = (event:any) => {
    event.preventDefault();

    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('touchmove', handleMouseMove, true);
    document.removeEventListener('touchend', handleMouseUp, true);

    setActive(false);

    onSliderInactive && onSliderInactive(event);

    onMouseUp && onMouseUp(event);
  };

  const handleMouseDown = (event:any) => {
    // event.preventDefault();
    // event.stopPropagation();

    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('touchmove', handleMouseMove, true);
    document.addEventListener('touchend', handleMouseUp, true);

    setActive(true);

    if (onSliderActive) {
      onSliderActive(event);
    }

    handleMouseMove(event);

    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  // 快捷键
  const handleKeyPress = (event:KeyboardEvent) => {
    if (event.which === 37 || event.which === 40) {
      event.preventDefault();
      event.stopPropagation();
      stepBack();
    } else if (event.which === 38 || event.which === 39) {
      event.preventDefault();
      event.stopPropagation();
      stepForward();
    }
  };

  const handleFocus = (event:any) => {
    document.addEventListener('keydown', handleKeyPress, true);
    onFocus && onFocus(event);
  };

  const handleBlur = (event:any) => {
    document.removeEventListener('keydown', handleKeyPress, true);
    onBlur && onBlur(event);
  };

  const handleClick = (event:any) => {
    event.preventDefault();
    // event.stopPropagation();
    onClick && onClick(event);
  };

  // 快进
  const stepForward = () => {
    onStepForward && onStepForward();
  };

  // 快退
  const stepBack = () => {
    onStepBack && onStepBack();
  };

  const renderChildren = () => {
    let progress = getPercent() || 0;

    if (typeof progress !== 'number' || progress < 0 || progress === Infinity) {
      progress = 0;
    }

    const percentage = `${(progress * 100).toFixed(2)}%`;
    return React.Children.map(children, (child) =>
      React.cloneElement(child, { progress, percentage })
    );
  };

  return (
    <div
      // className={classnames(
      //     {
      //         'mlz-controller-slider-sliding': active
      //     },
      //         'mlz-controller-slider'
      //     )}
      className="mlz-controller-slider"
      id="mlz-controller-slider"
      ref={ref}
      role="slider"
      aria-label={'mlz-controller-slider'}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      aria-valuenow={+valuenow || 0}
      aria-valuetext={valuetext || ''}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {renderChildren()}
    </div>
  );
});

Slider.displayName = 'Slider';
