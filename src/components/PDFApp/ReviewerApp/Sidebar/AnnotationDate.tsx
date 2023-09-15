import { FC, MutableRefObject, useEffect, useRef } from "react";
import { format, cancel } from "timeago.js";

type TAnnotationDateProps = {
  createdAt: string | Date;
  className?: string;
};

const AnnotationDate: FC<TAnnotationDateProps> = ({ createdAt, className }) => {
  const ref = useRef() as MutableRefObject<HTMLTimeElement>;

  useEffect(() => {
    return () => {
      cancel(ref.current);
    };
  }, []);

  return (
    <time ref={ref} className={className ?? "text-xs text-gray-400"}>
      {format(createdAt)}
    </time>
  );
};

export default AnnotationDate;
