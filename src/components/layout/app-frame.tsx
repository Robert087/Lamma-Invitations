import Link from "next/link";

type AppFrameProps = {
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function AppFrame({ children, action }: AppFrameProps) {
  return (
    <div className="lm-shell">
      <header className="lm-wrap lm-topbar">
        <Link className="lm-brand" href="/">Lamma</Link>
        {action}
      </header>
      {children}
    </div>
  );
}
