import type { ReactNode } from "react";
import { Link } from "react-router";
import { isWecExternal, wecHomeHref } from "./host";

export default function WecHomeLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const href = wecHomeHref();
  if (isWecExternal()) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}
