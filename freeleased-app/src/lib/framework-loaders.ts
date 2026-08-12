// Raw JSON loaders (Vite ?raw support) for the 4 jurisdiction frameworks
// in ../src/data/frameworks/. These are bundled inline so the deployed
// app works from any static host with no API.
import bbRaw from '@workspace/src/data/frameworks/bb-framework.json?raw';
import jmRaw from '@workspace/src/data/frameworks/jm-framework.json?raw';
import kyRaw from '@workspace/src/data/frameworks/ky-framework.json?raw';
import ukRaw from '@workspace/src/data/frameworks/uk-framework.json?raw';

export function loadFramework(code: 'BB' | 'JM' | 'KY' | 'UK'): unknown {
  switch (code) {
    case 'BB': return JSON.parse(bbRaw);
    case 'JM': return JSON.parse(jmRaw);
    case 'KY': return JSON.parse(kyRaw);
    case 'UK': return JSON.parse(ukRaw);
  }
}

export const FRAMEWORK_RAW = { BB: bbRaw, JM: jmRaw, KY: kyRaw, UK: ukRaw } as const;