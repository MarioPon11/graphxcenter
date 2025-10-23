import React from "react";

export function Gxsio({
  className,
  viewBox = "0 0 24 24",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox={viewBox} {...props}>
      <g>
        <path
          fill="#38B8E5"
          d="M17.5,9c-0.2,0-0.4,0-0.7,0c-2.2,0.1-3.7,1.3-4.8,3c-1.2-1.8-2.8-2.9-4.9-3c-0.2,0-0.4,0-0.6,0
		C7.1,6.6,9.3,4.7,12,4.7C14.7,4.7,16.9,6.6,17.5,9z"
        />
        <path
          fill="#36DDE6"
          d="M12,12l-2.7,3.4l-3,3.8C3.9,18.9,2,16.7,2,14.2c0-2.6,2-4.8,4.5-5.1c0.2,0,0.4,0,0.6,0
		C9.2,9.1,10.8,10.2,12,12z"
        />
        <path
          fill="#3871E5"
          d="M22,14.1c0,2.8-2.3,5.2-5.1,5.2l-9.7,0c-0.3,0-0.5,0-0.7-0.1l3-3.8L12,12c1.1-1.7,2.6-2.9,4.8-3
		c0.2,0,0.5,0,0.7,0C20.1,9.4,22,11.5,22,14.1z"
        />
      </g>
    </svg>
  );
}
