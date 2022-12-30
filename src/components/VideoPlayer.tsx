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
} from 'react-icons/io';

const VideoPlayer = () => {
  const videoRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [quailty, setQuailty] = useState<string>('720p');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(
    videoRef.current?.currentTime || 0
  );
  const [progress, setProgress] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(
    videoRef.current?.duration || 0
  );
  const [duration, setDuration] = useState<number>(videoRef.current?.duration || 0);
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(0);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const forwardVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 15;
    }
  };

  const backwardVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 15;
    }
  };

  const handleProgressChange = (e: any) => {
    setProgress(videoRef.current?.duration * e.target.value);
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setRemainingTime(videoRef.current.duration - videoRef.current.currentTime);
    }
  };

  useEffect(() => {
    //1 second interval
    setInterval(() => {
      handleTimeUpdate();
    }, 1000);

    // update duration
  }, [videoRef.current?.currentTime]);

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuailty(e.target.value);
    setIsPlaying(true);
  };

  const handleProgress = (e: any) => {
    if (isNaN(e.target.duration))
      // duration is NotaNumber at Beginning.
      return;
    setProgress((e.target.currentTime / e.target.duration) * 100);
  };

  return (
    <Container>
      <Video
        src={quailty === '1080p' ? video1080 : video720}
        ref={videoRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        muted={isMuted}
        onClick={togglePlay}
        autoPlay
      />

      <ProgressWrapper>
        <CurrentTime>{formatTime(currentTime)}</CurrentTime>

        <ProgressBar id='progress-bar' type='range' min={min} max={max} />

        <Duration>{formatDuration(remainingTime)}</Duration>
      </ProgressWrapper>

      <Controls>
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
                type='checkbox'
                name='quality'
                value='720p'
                onChange={handleQualityChange}
                checked={quailty === '720p'}
              />
              <label>720p</label>

              <input
                type='checkbox'
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
`;

const Video = styled.video`
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 425px) {
    width: 100%;
    height: 100%;
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

  transition: all 0.3s ease-in-out;
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
`;

const EditIcon = styled(AiFillEdit)`
  font-size: 25px;
`;

const ProgressBar = styled.input`
  width: 90%;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  border-radius: 10px;

  outline: none;
`;

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
`;

const CurrentTime = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
`;
const Duration = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;

  color: #ffffff;
`;

export default VideoPlayer;
