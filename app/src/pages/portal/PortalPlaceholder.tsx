import "../../App.css";
import { Card } from "../../components/Card";

interface PortalPlaceholderProps {
  eyebrow: string;
  title: string;
}

/*
 * Stand-in for every portal route that has been mapped out but not yet built.
 * Keeps the full navigation surface clickable while the real pages land.
 */
export function PortalPlaceholder({ eyebrow, title }: PortalPlaceholderProps) {
  return (
    <Card eyebrow={eyebrow} title={title}>
      <p className="portal__lede">
        Coming soon. This section is part of the planned portal and will be built
        out here.
      </p>
    </Card>
  );
}
