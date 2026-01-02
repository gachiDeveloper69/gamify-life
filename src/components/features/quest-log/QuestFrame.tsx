import CornerTL from '@/assets/svg/quest-frame/frame-corner-tl.svg?react';
import CornerTR from '@/assets/svg/quest-frame/frame-corner-tr.svg?react';
import CornerBL from '@/assets/svg/quest-frame/frame-corner-bl.svg?react';
import CornerBR from '@/assets/svg/quest-frame/frame-corner-br.svg?react';

import Top from '@/assets/svg/quest-frame/frame-top.svg?react';
import Right from '@/assets/svg/quest-frame/frame-right.svg?react';
import Left from '@/assets/svg/quest-frame/frame-left.svg?react';
import Bottom from '@/assets/svg/quest-frame/frame-bottom.svg?react';

type QuestFrameProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function QuestFrame({ className = '', children }: QuestFrameProps) {
  return (
    <div className={`qframe ${className}`}>
      {/* corners */}
      <CornerTL className="qframe__corner qframe__corner--tl" />
      <CornerTR className="qframe__corner qframe__corner--tr" />
      <CornerBL className="qframe__corner qframe__corner--bl" />
      <CornerBR className="qframe__corner qframe__corner--br" />

      {/* sides */}
      <Top className="qframe__edge qframe__edge--top" />
      <Right className="qframe__edge qframe__edge--right" />
      <Bottom className="qframe__edge qframe__edge--bottom" />
      <Left className="qframe__edge qframe__edge--left" />

      {/* center */}
      <div className="qframe__center">
        <div className="qframe__bg">
          <span className="scanline" aria-hidden />
        </div>
        <div className="qframe__content">{children}</div>
      </div>
    </div>
  );
}
