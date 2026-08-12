import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TabNexus } from './components/TabNexus';
import { TabInfrastructure } from './components/TabInfrastructure';
import { TabShadowState } from './components/TabShadowState';
import { TabDemographics } from './components/TabDemographics';
import { TabGlobalTransit } from './components/TabGlobalTransit';
import { TabPredictiveRisk } from './components/TabPredictiveRisk';
import { TabRegionalHeatmap } from './components/TabRegionalHeatmap';
import { TabWarRoom } from './components/TabWarRoom';
import { TabGridEnergy } from './components/TabGridEnergy';
import { TabSovereignCapital } from './components/TabSovereignCapital';
import { TabMunicipalCascade } from './components/TabMunicipalCascade';
import { TabProcurementCartel } from './components/TabProcurementCartel';
import { TabGlobalFramework } from './components/TabGlobalFramework';
import { TabJurisdictionLegal } from './components/TabJurisdictionLegal';
import { TabHumanRights } from './components/TabHumanRights';
import { TabModernSlavery } from './components/TabModernSlavery';
import { TabNexusStoryboard } from './components/TabNexusStoryboard';
import { TabIntelProcessing } from './components/TabIntelProcessing';

import { TabCommandCenter } from './components/TabCommandCenter';
import { TabFutureResearch } from './components/TabFutureResearch';
import { TabMultiIntFusion } from './components/TabMultiIntFusion';
import { TabAuditTrail } from './components/TabAuditTrail';
import { TabResearchBrief } from "./components/TabResearchBrief";

import { TabMilitaryDoctrine } from "./components/TabMilitaryDoctrine";
import { TabLiveDetection } from "./components/TabLiveDetection";
import { TabWarGaming } from "./components/TabWarGaming";

export default function App() {
  const [activeTab, setActiveTab] = useState('command_center');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'command_center' && <TabCommandCenter />}
      {activeTab === 'live_detection' && <TabLiveDetection />}
      {activeTab === 'war_gaming' && <TabWarGaming />}
      {activeTab === 'intel_processing' && <TabIntelProcessing />}
      {activeTab === 'nexus' && <TabNexus />}
      {activeTab === 'nexus_storyboard' && <TabNexusStoryboard />}
      {activeTab === 'infrastructure' && <TabInfrastructure />}
      {activeTab === 'shadow_state' && <TabShadowState />}
      {activeTab === 'demographics' && <TabDemographics />}
      {activeTab === 'global_transit' && <TabGlobalTransit />}
      {activeTab === 'predictive_risk' && <TabPredictiveRisk />}
      {activeTab === 'regional_heatmap' && <TabRegionalHeatmap />}
      {activeTab === 'war_room' && <TabWarRoom />}
      {activeTab === 'grid_energy' && <TabGridEnergy />}
      {activeTab === 'sovereign_capital' && <TabSovereignCapital />}
      {activeTab === 'municipal_cascade' && <TabMunicipalCascade />}
      {activeTab === 'procurement_cartel' && <TabProcurementCartel />}
      {activeTab === 'global_framework' && <TabGlobalFramework />}
      {activeTab === 'jurisdiction_legal' && <TabJurisdictionLegal />}
      {activeTab === 'human_rights' && <TabHumanRights />}
      {activeTab === 'modern_slavery' && <TabModernSlavery />}
      {activeTab === 'future_research' && <TabFutureResearch />}
      {activeTab === 'multi_int_fusion' && <TabMultiIntFusion />}
      {activeTab === 'audit_trail' && <TabAuditTrail />}
      {activeTab === 'research_brief' && <TabResearchBrief />}

      {activeTab === 'military_doctrine' && <TabMilitaryDoctrine />}
    </Layout>
  );
}
