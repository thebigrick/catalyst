import React from 'react';

import { getPlugins } from './registry';

export function withPlugins<P extends object>(
  component: string,
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithPlugins: React.FC<P> = (props) => {
    let Enhanced = WrappedComponent;

    getPlugins(component).forEach((plugin) => {
      Enhanced = plugin.wrap(Enhanced);
    });

    return <Enhanced {...props} />;
  };

  WithPlugins.displayName = `WithPlugins(${displayName})`;

  return WithPlugins;
}
