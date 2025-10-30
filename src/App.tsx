import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Auth
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

// Data Pipeline Pages (NEW)
import DataAcquisitionHub from '@/pages/DataAcquisitionHub';
import ETLPipelineViewer from '@/pages/ETLPipelineViewer';

// AI Generation Pages (NEW)
import AIGCStudio from '@/pages/AIGCStudio';
import ContentScoringCenter from '@/pages/ContentScoringCenter';

// Publishing Pages (NEW)
import MultiChannelPublisher from '@/pages/MultiChannelPublisher';
import CitationMonitor from '@/pages/CitationMonitor';

// Analytics Pages (NEW)
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';

// Existing Pages
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
import GeoMappingNetwork from '@/pages/GeoMappingNetwork';

function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Routes>
          {/* Public route - Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes - All pages require authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Default route redirects to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* Data Pipeline Pages (NEW) */}
            <Route path="data-acquisition" element={<DataAcquisitionHub />} />
            <Route path="etl-pipeline" element={<ETLPipelineViewer />} />

            {/* AI Generation Pages (NEW) */}
            <Route path="aigc-studio" element={<AIGCStudio />} />
            <Route path="content-scoring" element={<ContentScoringCenter />} />

            {/* Publishing Pages (NEW) */}
            <Route path="multi-channel-publisher" element={<MultiChannelPublisher />} />
            <Route path="citation-monitor" element={<CitationMonitor />} />

            {/* Analytics Pages (NEW) */}
            <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />

            {/* Existing Pages */}
            <Route path="roadmap" element={<RoadmapManager />} />
            <Route path="content" element={<ContentRegistry />} />
            <Route path="prompts" element={<PromptLandscape />} />
            <Route path="generator" element={<ContentGenerator />} />
            <Route path="citations" element={<CitationTracker />} />
            <Route path="kpi" element={<KPIDashboard />} />
            <Route path="battlefield" element={<BattlefieldMap />} />
            <Route path="geo-mapping-network" element={<GeoMappingNetwork />} />
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
    </AuthProvider>
  );
}

export default App;
