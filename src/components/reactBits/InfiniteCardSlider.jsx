import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InfiniteCardSlider = ({ children }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return;

    const container = containerRef.current;
    const cards = cardsRef.current;
    const cardsArray = gsap.utils.toArray('.infinite-card');
    
    // Auto-play functionality
    const autoPlay = () => {
      if (isAnimatingRef.current) return;
      
      const nextIndex = (currentIndexRef.current + 1) % cardsArray.length;
      animateToCard(nextIndex, 'next');
    };

    // Animation function
    const animateToCard = (targetIndex, direction = 'next') => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const currentCard = cardsArray[currentIndexRef.current];
      const targetCard = cardsArray[targetIndex];
      
      if (!targetCard) {
        isAnimatingRef.current = false;
        return;
      }

      // Reset all cards
      gsap.set(cardsArray, { 
        scale: 0.8, 
        opacity: 0.5, 
        zIndex: 1 
      });

      // Animate current card out
      gsap.to(currentCard, {
        xPercent: direction === 'next' ? -400 : 400,
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(currentCard, { xPercent: 0 });
        }
      });

      // Animate target card in
      gsap.fromTo(targetCard,
        { 
          xPercent: direction === 'next' ? 400 : -400,
          scale: 0.5,
          opacity: 0,
          zIndex: 100
        },
        {
          xPercent: 0,
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            currentIndexRef.current = targetIndex;
            isAnimatingRef.current = false;
          }
        }
      );
    };

    // Initialize cards
    gsap.set(cardsArray, { 
      scale: 0.8, 
      opacity: 0.5, 
      xPercent: 0 
    });
    gsap.set(cardsArray[0], { 
      scale: 1, 
      opacity: 1, 
      zIndex: 100 
    });

    // Auto-play interval
    const interval = setInterval(autoPlay, 2000);

    // Navigation functions
    const nextCard = () => {
      const nextIndex = (currentIndexRef.current + 1) % cardsArray.length;
      animateToCard(nextIndex, 'next');
    };

    const prevCard = () => {
      const prevIndex = currentIndexRef.current === 0 ? cardsArray.length - 1 : currentIndexRef.current - 1;
      animateToCard(prevIndex, 'prev');
    };

    // Button event listeners
    const nextBtn = container.querySelector('.next-btn');
    const prevBtn = container.querySelector('.prev-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', nextCard);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', prevCard);
    }

    // Touch/swipe functionality
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          nextCard(); // Swipe left - next card
        } else {
          prevCard(); // Swipe right - previous card
        }
      }
    };

    cards.addEventListener('touchstart', handleTouchStart, { passive: true });
    cards.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      clearInterval(interval);
      if (nextBtn) nextBtn.removeEventListener('click', nextCard);
      if (prevBtn) prevBtn.removeEventListener('click', prevCard);
      cards.removeEventListener('touchstart', handleTouchStart);
      cards.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className="infinite-card-container relative w-full h-full">
      <div ref={cardsRef} className="infinite-cards relative w-full h-full flex items-center justify-center">
        {React.Children.map(children, (child, index) => (
          <div
  key={index}
  className="infinite-card absolute w-[600px] h-[100%] bg-center bg-contain bg-no-repeat rounded-xl"
  style={{
    backgroundImage: `url(${child.props.backgroundImage})`,
  }}
>

            <div className="w-full h-full rounded-xl border border-white/20 shadow-xl overflow-hidden">
              <div className="h-10 bg-[#1e1e1e] px-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>

              <div className="flex flex-col items-center justify-center h-full text-center text-white px-6 relative">
                {/* Black gradient overlay for better text readability */}
                <div >
                <img src={child.props.logo} className='w-[300px] h-[300px] absolute top-12 left-40' alt='no image'/>

                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#ab1428]/10 via-[#ab1428]/10 to-transparent rounded-xl"></div>
                
                <div className="relative z-10  w-[25rem] mt-48">
                  <h3 className="text-2xl font-semibold drop-shadow-lg mb-3 text-black">
                    {child.props.title}
                  </h3>
                  <p className="text-base drop-shadow-lg leading-relaxed text-black">
                    {child.props.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Actions */}
      {/* <div className="actions absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4">
        <button className="prev-btn bg-[#ab1428] text-white px-6 py-2 rounded-t-[20px] transition-all duration-300 ease-out hover:bg-white hover:text-[#ab1428] hover:scale-105 hover:shadow-lg active:scale-95 font-medium">
          ← Prev
        </button>
        <button className="next-btn bg-[#ab1428] text-white px-6 py-2 rounded-t-[20px] transition-all duration-300 ease-out hover:bg-white hover:text-[#ab1428] hover:scale-105 hover:shadow-lg active:scale-95 font-medium">
          Next →
        </button>
      </div> */}
    </div>
  );
};

export default InfiniteCardSlider;
