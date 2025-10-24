import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Pages (to be created)
import Dashboard from '@/pages/Dashboard';
import RoadmapManager from '@/pages/RoadmapManager';
import ContentRegistry from '@/pages/ContentRegistry';
import PromptLandscape from '@/pages/PromptLandscape';
import ContentGenerator from '@/pages/ContentGenerator';
import CitationTracker from '@/pages/CitationTracker';
import KPIDashboard from '@/pages/KPIDashboard';
import BattlefieldMap from '@/pages/BattlefieldMap';
import WorkflowMonitor from '@/pages/WorkflowMonitor';
import SystemSettings from '@/pages/SystemSettings';
import TemplateEditor from '@/pages/TemplateEditor';
import AnalyticsReports from '@/pages/AnalyticsReports';
import ContentCoverage from '@/pages/ContentCoverage';
import CitationStrength from '@/pages/CitationStrength';
import UserManagement from '@/pages/UserManagement';
import Help from '@/pages/Help';
import Offers from '@/pages/Offers';
import Orders from '@/pages/Orders';
import ContentMapping from '@/pages/ContentMapping';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Default route redirects to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* 15 Core Pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="roadmap" element={<RoadmapManager />} />
          <Route path="content" element={<ContentRegistry />} />
          <Route path="prompts" element={<PromptLandscape />} />
          <Route path="generator" element={<ContentGenerator />} />
          <Route path="citations" element={<CitationTracker />} />
          <Route path="kpi" element={<KPIDashboard />} />
          <Route path="battlefield" element={<BattlefieldMap />} />
          <Route path="content-mapping" element={<ContentMapping />} />
          <Route path="workflow" element={<WorkflowMonitor />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="templates" element={<TemplateEditor />} />
          <Route path="reports" element={<AnalyticsReports />} />
          <Route path="coverage" element={<ContentCoverage />} />
          <Route path="citation-strength" element={<CitationStrength />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="help" element={<Help />} />

          {/* Conversion Pages */}
          <Route path="offers" element={<Offers />} />
          <Route path="orders" element={<Orders />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
