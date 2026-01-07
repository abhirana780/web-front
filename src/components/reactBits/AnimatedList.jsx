import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const AnimatedItem = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const keyboardNavRef = useRef(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        keyboardNavRef.current = true;
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        keyboardNavRef.current = true;
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNavRef.current || selectedIndex < 0 || !listRef.current)
      return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    keyboardNavRef.current = false;
  }, [selectedIndex]);

  return (
    <div className={`relative w-full max-w-full ${className}`}>
      <div
        ref={listRef}
        className="

  w-full
  max-w-full
  sm:max-w-[30rem]
  lg:max-w-[40rem]
  xl:max-w-[50rem]
  max-h-[400px]
  overflow-y-auto
  p-4
"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          scrollbarColor: "#374151 #0f172a",
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
  key={index}
  delay={0.1}
  index={index}
  onMouseEnter={() => setSelectedIndex(index)}
  onClick={() => {
    setSelectedIndex(selectedIndex === index ? -1 : index);
    if (onItemSelect) {
      onItemSelect(item, index);
    }
  }}
>
  <div
    className={`
      p-4 rounded-xl cursor-pointer transition-all duration-300 
      m-2 sm:m-4 w-full
      flex flex-col sm:flex-row sm:items-center justify-between gap-3
      ${
        selectedIndex === index
          ? "bg-gray-200 shadow-lg scale-[1.02]"
          : "shadow-md hover:shadow-lg hover:bg-gray-100 hover:scale-105"
      }
      ${itemClassName}
    `}
  >
    {/* Question Section */}
    <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full">
      <span className="text-[#ab1428] font-bold text-base sm:text-lg">
        {index + 1}.
      </span>

      <p className="text-black font-semibold text-sm sm:text-lg m-0 tracking-wide leading-snug 
                     break-words text-wrap w-full">
        {item.name}
      </p>
    </div>

    {/* Dropdown Icon */}
    <motion.div
      initial={false}
      animate={{ rotate: selectedIndex === index ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0 self-end sm:self-center"
    >
      <ChevronDown size={22} className="text-[#ab1428]" />
    </motion.div>
  </div>

  {/* Answer Dropdown */}
  <AnimatePresence>
    {selectedIndex === index && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden border-t border-b mx-2 sm:mx-4"
      >
        <div className="p-3 sm:p-4 bg-white">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
            {item.description}
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</AnimatedItem>

        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px]  to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px]  to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
