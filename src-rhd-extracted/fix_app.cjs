const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const newImports = `
import { TabMultiIntFusion } from './components/TabMultiIntFusion';
import { TabAuditTrail } from './components/TabAuditTrail';
`;
code = code.replace(/import \{ TabFutureResearch \} from '\.\/components\/TabFutureResearch';/, "import { TabFutureResearch } from './components/TabFutureResearch';" + newImports);

const newRoutes = `
      {activeTab === 'multi_int_fusion' && <TabMultiIntFusion />}
      {activeTab === 'audit_trail' && <TabAuditTrail />}
`;
code = code.replace(/\{activeTab === 'future_research' && <TabFutureResearch \/>\}/, "{activeTab === 'future_research' && <TabFutureResearch />}" + newRoutes);

fs.writeFileSync('App.tsx', code);
