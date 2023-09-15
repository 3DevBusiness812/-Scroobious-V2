import { FC, MutableRefObject, useEffect, useRef } from "react";
import { format, cancel } from "timeago.js";

type DateFormatterProps = {
  dt: string | Date;
  className?: string;
};

const DateFormatter: FC<DateFormatterProps> = ({ dt, className }) => {
  const ref = useRef() as MutableRefObject<HTMLTimeElement>;

  useEffect(() => {
    return () => {
      cancel(ref.current);
    };
  }, []);

  return (
    <time ref={ref} className={className ?? "text-xs text-gray-400"}>
      {format(dt)}
    </time>
  );
};

export default DateFormatter;
