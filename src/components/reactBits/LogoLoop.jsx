import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
};

const cx = (...parts) => parts.filter(Boolean).join(' ');

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();
    return () => observers.forEach(observer => observer?.disconnect());
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) return onLoad();

    let remaining = images.length;

    const handle = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };

    images.forEach(img => {
      if (img.complete) handle();
      else {
        img.addEventListener('load', handle, { once: true });
        img.addEventListener('error', handle, { once: true });
      }
    });

    return () =>
      images.forEach(img => {
        img.removeEventListener('load', handle);
        img.removeEventListener('error', handle);
      });
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical) => {
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const seqSize = isVertical ? seqHeight : seqWidth;
    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = isVertical
        ? `translateY(${-offsetRef.current}px)`
        : `translateX(${-offsetRef.current}px)`;
    }

    const animate = ts => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;

      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const smooth = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * smooth;

      if (seqSize > 0) {
        let next = offsetRef.current + velocityRef.current * dt;
        next = ((next % seqSize) + seqSize) % seqSize;
        offsetRef.current = next;

        track.style.transform = isVertical
          ? `translateY(${-next}px)`
          : `translateX(${-next}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical]);
};

export const LogoLoop = memo(
  ({
    logos,
    speed,
    direction = "left",
    width = "100%",
    logoHeight = 50,
    gap = 80,
    pauseOnHover,
    hoverSpeed,
    scaleOnHover = true,
    ariaLabel = "Partner logos",
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState(2);
    const [isHovered, setIsHovered] = useState(false);

    const isVertical = direction === "up" || direction === "down";

    const targetVelocity = useMemo(() => {
      const base = Math.abs(speed);
      const dir = isVertical
        ? direction === "up"
          ? 1
          : -1
        : direction === "left"
        ? 1
        : -1;
      return base * dir;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const rect = seqRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (isVertical) {
        setSeqHeight(rect.height);
        const viewport = containerRef.current?.clientHeight ?? rect.height;
        setCopyCount(Math.ceil(viewport / rect.height) + 2);
      } else {
        setSeqWidth(rect.width);
        const viewport = containerRef.current?.clientWidth ?? rect.width;
        setCopyCount(Math.ceil(viewport / rect.width) + 2);
      }
    }, [isVertical]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, logoHeight, gap]);
    useImageLoader(seqRef, updateDimensions, [logos]);

    useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical);

    const renderItem = useCallback(
      (item, key) => {
        const content = item.node ? (
          <span
            style={{
              fontSize: `${logoHeight}px`,
              height: `${logoHeight}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666"
            }}
          >
            {item.node}
          </span>
        ) : (
          <img
            src={item.src}
            alt={item.alt ?? ""}
            style={{
              height: `${logoHeight}px`,
              width: "auto",
              objectFit: "contain"
            }}
          />
        );

        return (
          <li
            key={key}
            style={{
              marginRight: !isVertical ? `${gap}px` : undefined,
              marginBottom: isVertical ? `${gap}px` : undefined
            }}
            className={cx(
              "flex-none",
              scaleOnHover && "transition-transform duration-300 hover:scale-110"
            )}
          >
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer noopener">
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      },
      [gap, isVertical, logoHeight, scaleOnHover]
    );

    return (
      <div
        ref={containerRef}
        className={cx("relative overflow-hidden", className)}
        style={{ width, ...style }}
        aria-label={ariaLabel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={trackRef}
          className={cx(isVertical ? "flex flex-col" : "flex flex-row")}
          style={{ willChange: "transform" }}
        >
          {Array.from({ length: copyCount }).map((_, idx) => (
            <ul
              key={idx}
              ref={idx === 0 ? seqRef : undefined}
              className={cx(isVertical ? "flex flex-col" : "flex flex-row")}
            >
              {logos.map((item, i) => renderItem(item, `${idx}-${i}`))}
            </ul>
          ))}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;
