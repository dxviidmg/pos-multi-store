import { memo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const CustomTooltip = memo(({ children, text, position }) => {
  const renderTooltip = (props) => (
    <Tooltip id="tooltip-hover" {...props} className="custom-tooltip-primary">
      {text}
    </Tooltip>
  );

  return (
    <div>
      <OverlayTrigger placement={position || "right"} overlay={renderTooltip}>
        <div>{children}</div>
      </OverlayTrigger>
    </div>
  );
});

export default CustomTooltip;
