import { useEffect, useRef } from 'react';
import { drawPoster, getLuxuryBg, type PosterOptions } from '@/lib/posters';

interface Props {
  options: PosterOptions;
  className?: string;
  /** دقة أقل لمعاينات مصغرة (1 = كامل الدقة) */
  scale?: number;
}

/**
 * يرسم المنشور على canvas ويعيد الرسم عند أي تغيير.
 * ينتظر تحميل الخطوط والخلفية الفاخرة أولاً لضمان ظهور العربية
 * والصور بشكل صحيح في المعاينة والصورة المحفوظة.
 */
export function PosterCanvas({ options, className, scale = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      if (cancelled || !ref.current) return;
      drawPoster(ref.current, optionsRef.current, scale);
    };

    // إعادة الرسم فور اكتمال تحميل الخلفية الفاخرة
    const bg = getLuxuryBg();
    if (!bg.complete) {
      bg.addEventListener('load', draw, { once: true });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(draw).catch(draw);
      // أعد الرسم بعد لحظة قصيرة أيضاً لضمان اكتمال تحميل الأوزان
      const t = setTimeout(draw, 350);
      return () => {
        cancelled = true;
        clearTimeout(t);
        bg.removeEventListener('load', draw);
      };
    }
    draw();
    return () => {
      cancelled = true;
      bg.removeEventListener('load', draw);
    };
  }, [options, scale]);

  return (
    <div className={`canvas-container ${className ?? ''}`}>
      <canvas ref={ref} />
    </div>
  );
}
