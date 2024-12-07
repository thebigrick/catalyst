import React from 'react';

export type Plugin = {
  component: string;
  name: string;
  wrap: (Component: React.ComponentType<any>) => React.ComponentType<any>;
};
