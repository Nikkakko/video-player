import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import video1080 from '../assets/video/v1080.mp4';
import video720 from '../assets/video/v720.mp4';
import { AiFillEdit } from 'react-icons/ai';

import {
  IoMdPlay,
  IoMdPause,
  IoMdSkipForward,
  IoMdSkipBackward,
  IoMdSettings,
  IoMdVolumeHigh,
  IoMdVolumeLow,
  IoMdVolumeMute,
} from 'react-icons/io';
import { IoVolumeMedium } from 'react-icons/io5';

type ProgressBarProps = {
  currentTime: any;
  duration?: any;
};

const VideoPlayer = () => {
  const videoRef = useRef<any>(null);
  const progressBarRef = useRef<any>(null);
  const volumeRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [quailty, setQuailty] = useState<string>('720p');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number | string>(0);

  const [isVisible, setIsVisible] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const forwardVideo = () => {
    if (videoRef.current) {
      setCurrentTime((videoRef.current.currentTime += 15));
    }
  };

  const backwardVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 15;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const formatDuration = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const hour = Math.floor(time / 3600);

    return `${hour.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // videoRef.current.pause();
    setCurrentTime(videoRef.current.currentTime);

    setQuailty(e.target.value);
    // videoRef.current.currentTime = currentTime;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setRemainingTime(videoRef.current.duration - videoRef.current.currentTime);
      progressBarRef.current.max = videoRef.current?.duration;
      progressBarRef.current.value = videoRef.current?.currentTime;
      videoRef.current.volume = volumeRef.current?.value;
      setDuration(videoRef.current.duration);
    }
  };

  const handleChangeRange = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = progressBarRef.current.value;
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.volume = event.target.value;
    }

    // change event.target.value with mouse wheel

    if (event.target.value === '0') {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMute = () => {
    if (!videoRef.current?.muted) {
      volumeRef.current.value = '0';
    }

    if (videoRef.current?.volume === 0) {
      volumeRef.current.value = '0.2';
    }
  };

  const changeVolumeIcon = () => {
    if (volumeRef.current?.value === '0') {
      return <IoMdVolumeMute onClick={handleMute} />;
    } else if (volumeRef.current?.value <= '0.4') {
      return <IoMdVolumeLow onClick={handleMute} />;
    } else if (volumeRef.current?.value <= '0.7') {
      return <IoVolumeMedium onClick={handleMute} />;
    } else {
      return <IoMdVolumeHigh onClick={handleMute} />;
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      togglePlay();
    }

    if (event.keyCode === 39) {
      // Right arrow key
      if (videoRef.current) {
        videoRef.current.currentTime += 15; // Forward video by 15 seconds
      }
    } else if (event.keyCode === 37) {
      // Left arrow key
      if (videoRef.current) {
        videoRef.current.currentTime -= 15; // Backward video by 15 seconds
      }
    } else if (event.keyCode === 77) {
      // "m" key
      if (videoRef.current) {
        handleMute();
      }
    }
  };

  // change volume with mouse wheel
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      if (volumeRef.current?.value > 0) {
        volumeRef.current.value -= 0.1;
        setVolume(parseFloat(volumeRef.current.value));
      }
    } else {
      if (volumeRef.current?.value < 1) {
        volumeRef.current.value = Number(volumeRef.current?.value) + 0.1;
        setVolume(parseFloat(volumeRef.current.value));
      }
    }
  };

  useEffect(() => {
    volumeRef.current.addEventListener('wheel', handleWheel);
    document.addEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    //1 second interval
    setInterval(() => {
      handleTimeUpdate();
    }, 1000);
  }, []);

  useEffect(() => {
    videoRef.current.currentTime = currentTime - 1;
  }, [quailty]);

  useEffect(() => {
    let timeoutId: number;

    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsVisible(false), 3000);
    };
    const handleMouseLeave = () => {
      setIsVisible(false);
      clearTimeout(timeoutId);
    };
    window.addEventListener('mousemove', handleMouseMove);
    if (videoRef.current) {
      videoRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (videoRef.current) {
        videoRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Container>
      <Video
        src={quailty === '1080p' ? video1080 : video720}
        ref={videoRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        // muted={isMuted}
        onClick={togglePlay}
        autoPlay
      />

      {}
      <ProgressWrapper style={{ opacity: isVisible ? '1' : '0' }}>
        <CurrentTime>{formatTime(currentTime)}</CurrentTime>

        <ProgressBar
          type='range'
          defaultValue='0'
          ref={progressBarRef}
          onChange={handleChangeRange}
          currentTime={currentTime}
          duration={duration}
        />

        <Duration>{formatDuration(remainingTime)}</Duration>
      </ProgressWrapper>

      <VolumeControls style={{ opacity: isVisible ? '1' : '0' }}>
        <VolumeInput
          type='range'
          ref={volumeRef}
          defaultValue='0'
          min={0}
          step={0.1}
          max={1}
          onChange={handleVolumeChange}
        />
        <VolumeLogo>{changeVolumeIcon()}</VolumeLogo>
      </VolumeControls>

      <Controls style={{ opacity: isVisible ? '1' : '0' }}>
        <EditButton>
          <EditIcon />
        </EditButton>
        <Backward>
          <SkipBackward onClick={backwardVideo} />
        </Backward>

        <PlayPause onClick={togglePlay}>
          {isPlaying ? <PauseButton /> : <PlayButton />}
        </PlayPause>
        <Forward>
          <SkipForward onClick={forwardVideo} />
        </Forward>
        <Options onClick={() => setIsSettingsOpen(prev => !prev)}>
          <Settings />
          {isSettingsOpen && (
            <QualityOptions>
              <input
                type='radio'
                name='quality'
                value='720p'
                onChange={handleQualityChange}
                checked={quailty === '720p'}
              />
              <label>720p</label>

              <input
                type='radio'
                name='quality'
                value='1080p'
                onChange={handleQualityChange}
                checked={quailty === '1080p'}
              />
              <label>1080p</label>
            </QualityOptions>
          )}
        </Options>
      </Controls>
    </Container>
  );
};

const Container = styled.div`
  overflow: hidden;
  width: 100vw;
  height: 100vh;

  @media (max-width: 425px) {
    /* width: 425px;
    height: 100vh; */
  }
`;

const Video = styled.video`
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 425px) {
    width: 425px;
    height: 100vh;
  }
`;

const Controls = styled.div`
  position: absolute;
  left: 50%;
  bottom: 50px;
  transform: translate(-50%, 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  /* margin-bottom: 50px; */

  @media (max-width: 425px) {
    svg {
      font-size: 20px;
    }
  }

  transition: all 0.2s ease-in-out;
`;

const PlayPause = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  width: 73px;
  height: 73px;
  cursor: pointer;

  @media (max-width: 425px) {
    width: 50px;
    height: 50px;
  }
`;
const PlayButton = styled(IoMdPlay)`
  font-size: 30px;
`;
const PauseButton = styled(IoMdPause)`
  font-size: 30px;
`;

const Backward = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  width: 53px;
  height: 53px;
  cursor: pointer;

  @media (max-width: 425px) {
    width: 40px;
    height: 40px;
  }
`;
const Forward = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  width: 53px;
  height: 53px;

  cursor: pointer;
  @media (max-width: 425px) {
    width: 40px;
    height: 40px;
  }
`;

const SkipForward = styled(IoMdSkipForward)`
  font-size: 25px;
`;
const SkipBackward = styled(IoMdSkipBackward)`
  font-size: 25px;
`;

const Options = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  width: 53px;
  height: 53px;
  cursor: pointer;

  @media (max-width: 425px) {
    width: 40px;
    height: 40px;
  }
`;

const Settings = styled(IoMdSettings)`
  font-size: 25px;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transition: all 0.2s ease-in-out;
    transform: rotate(180deg);
  }
`;

const QualityOptions = styled.div`
  background: #fff;
  border-radius: 5px;
  padding: 10px;

  display: flex;
  gap: 5px;
  position: absolute;
  bottom: 50px;
  left: 60px;
  /* left: 100px; */
  cursor: pointer;

  @media (max-width: 425px) {
    left: -50px;
    padding: 5px;
  }
`;

const EditButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  width: 53px;
  height: 53px;
  cursor: pointer;

  @media (max-width: 425px) {
    width: 40px;
    height: 40px;
  }
`;

const EditIcon = styled(AiFillEdit)`
  font-size: 25px;
`;

const VolumeControls = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  right: 23px;
  top: 236px;

  width: 77px;
  height: 351px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid #ffffff;
  backdrop-filter: blur(5px);
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 20px;

  svg {
    color: #fff;
    font-size: 25px;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 425px) {
    right: 0;
    top: 160px;

    width: 50px;
    height: 321px;
    border-radius: 12px;
  }

  transition: all 0.2s ease-in-out;
`;

const VolumeInput = styled.input`
  width: 19px;
  height: 249px;
  border-radius: 20px;
  border: none;
  background: #c4c4c4;
  cursor: pointer;
  appearance: none;

  /* &::-webkit-slider-thumb {
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
  } */

  &[type='range'] {
    appearance: slider-vertical;
    background: #ffffff;
    width: 19px;
    height: 249px;
  }

  &[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 19px;
    height: 249px;
    background: #ffffff;
    cursor: pointer;
    /* border-radius: 50%; */
  }
`;

const VolumeLogo = styled.div``;

const ProgressWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 90%;
  left: 50%;
  bottom: 140px;
  transform: translate(-50%, 50%);

  @media (max-width: 425px) {
    width: 80%;
    left: 45%;
  }

  transition: all 0.2s ease-in-out;
`;
const ProgressBar = styled.input<ProgressBarProps>`
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  appearance: none;

  &::before {
    content: '';
    height: 5px;
    width: ${({ currentTime, duration }) => `${(currentTime * 100) / duration}%`};
    background-color: rgba(255, 255, 255, 1);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    filter: blur(2px);
  }

  transition: all 0.2s ease-in-out;
`;

const CurrentTime = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;

  @media (max-width: 425px) {
    font-size: 18px;
  }
`;
const Duration = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;

  color: #ffffff;

  @media (max-width: 425px) {
    font-size: 18px;
  }
`;

export default VideoPlayer;
