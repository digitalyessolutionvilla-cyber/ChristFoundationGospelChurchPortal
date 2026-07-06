import * as LucideIcons from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconName } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, fab);

interface DynamicIconProps {
  library: 'lucide' | 'fa-solid' | 'fa-brands';
  name: string;
  className?: string;
}

export function DynamicIcon({ library: lib, name, className = 'w-6 h-6' }: DynamicIconProps) {
  if (lib === 'lucide') {
    const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
    if (!Icon) return <LucideIcons.HelpCircle className={className} />;
    return <Icon className={className} />;
  }

  const prefix = lib === 'fa-brands' ? 'fab' : 'fas';
  const iconName = name as IconName;
  return (
    <FontAwesomeIcon
      icon={[prefix, iconName]}
      className={className}
    />
  );
}
