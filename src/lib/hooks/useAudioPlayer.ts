import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export default function useAudioPlayer(audioFile: string) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      barWidth: 2,
      barRadius: 3,
      barGap: 2,
      barMinHeight: 5,
      cursorWidth: 1,
      backend: "WebAudio",
      height: 120,
      progressColor: "#1df485",
      responsive: true,
      waveColor: "#a3a3a3",
      cursorColor: "transparent",
    });

    wavesurfer.load(audioFile);
    wavesurferRef.current = wavesurfer;

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioFile]);

  return {
    waveformRef,
    playPause: wavesurferRef.current?.playPause.bind(wavesurferRef.current),
  };
}
