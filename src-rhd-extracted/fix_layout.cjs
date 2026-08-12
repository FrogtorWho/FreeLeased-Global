const fs = require('fs');
let code = fs.readFileSync('components/Layout.tsx', 'utf8');

const newTabs = `    {
      title: "Intelligence Integration",
      icon: <Network className="w-4 h-4" />,
      tabs: [
        { id: 'multi_int_fusion', label: 'Multi-INT Fusion' },
        { id: 'audit_trail', label: 'Provenance Ledger' },
      ]
    },`;

code = code.replace(
  /    \{\n      title: "Executive Summary",/,
  newTabs + '\n    {\n      title: "Executive Summary",'
);

fs.writeFileSync('components/Layout.tsx', code);
