"use client";
import { CSSProperties, useEffect, useRef, useState } from "react";

interface Props {
  maxLines: number;
}

export function useReadMoreText({ maxLines }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const maxHeight = lineHeight * maxLines;

        // Check if content height exceeds max height
        if (element.scrollHeight > maxHeight) {
          setShouldShowButton(true);
        } else {
          setShouldShowButton(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [maxLines]);

  const styles: CSSProperties = {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: isExpanded ? "unset" : maxLines,
    WebkitBoxOrient: "vertical",
    lineHeight: "1.6"
  };

  return {
    isExpanded,
    shouldShowButton,
    clickButton: () => setIsExpanded((prev) => !prev),
    styles,
    contentRef
  };
}

// HOW TO USE

//   <div className={className}>
//       <div
//         ref={contentRef}
//         style={{
//           overflow: 'hidden',
//           display: '-webkit-box',
//           WebkitLineClamp: isExpanded ? 'unset' : maxLines,
//           WebkitBoxOrient: 'vertical',
//           lineHeight: '1.6'
//         }}
//       >
//         {children}
//       </div>

//       {shouldShowButton && (
//         <button
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm focus:outline-none focus:underline"
//         >
//           {isExpanded ? 'Show Less' : 'Read More'}
//         </button>
//       )}
//     </div>
