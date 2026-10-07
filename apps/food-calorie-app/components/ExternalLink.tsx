import { type PropsWithChildren } from "react";
import { Platform } from "react-native";

type ExternalLinkProps = PropsWithChildren<{
  href: string;
}>;

export function ExternalLink({ href, children }: ExternalLinkProps) {
  if (Platform.OS === "web") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <>{children}</>;
}
