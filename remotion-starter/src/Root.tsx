import { Composition } from 'remotion';
import { StudioTitle } from './StudioTitle';
import { Promo } from './Promo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="StudioTitle"
        component={StudioTitle}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Promo"
        component={Promo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
