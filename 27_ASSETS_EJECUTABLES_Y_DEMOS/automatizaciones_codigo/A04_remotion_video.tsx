import { AbsoluteFill, Sequence } from 'remotion';
export const Video = ({title}: {title: string}) => (
  <AbsoluteFill style={{background: 'white', justifyContent: 'center', alignItems: 'center'}}>
    <Sequence from={0} durationInFrames={150}>
      <h1>{title}</h1>
    </Sequence>
  </AbsoluteFill>
);
