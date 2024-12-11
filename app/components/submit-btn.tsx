import React from "react";
import { Intent } from "~/utils/client-action-utils";

interface SubmitBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent: Intent;
}

const SubmitBtn: React.FC<SubmitBtnProps> = ({ intent, ...props }) => {
  const { name, type, ...buttonProps } = props;
  return (
    <button type="submit" name="intent" value={intent} {...buttonProps}>
      {props.children}
    </button>
  );
};

export default SubmitBtn;
