// src/app/core/services/mock-data.service.ts
// Central mock data — replace individual service calls with real API calls
// when the backend is ready. Pattern mirrors reference preorder.service.ts.
import { Injectable, signal } from '@angular/core';

// ── Types ─────────────────────────────────────────────────────────────────

export type Priority      = 'High' | 'Medium' | 'Low';
export type CaseStatus    = 'New' | 'In Progress' | 'On Customer' | 'On BlueLink' | 'Resolved' | 'Closed';
export type ProjectHealth = 'On Track' | 'At Risk' | 'Off Track';
export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
export type StepStatus    = 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
export type ReleaseStatus = 'Planned' | 'In Development' | 'QA' | 'Staged' | 'Released';

export interface Case {
  id: string; ticketNumber: string; title: string; description: string;
  priority: Priority; statusReason: CaseStatus; status: 'Active' | 'Resolved' | 'Closed';
  responseBy: string; createdOn: string; subjectId: string; productId: string | null;
  contact: string;
}

export interface CaseTimeline {
  id: string; caseId: string; type: 'Customer Reply' | 'Agent Reply' | 'System Note' | 'Status Change';
  description: string; createdOn: string; author: string;
}

export interface Project {
  id: string; name: string; status: ProjectStatus; startDate: string; endDate: string;
  percentCompleted: number; health: ProjectHealth; owner: string; description: string;
}

export interface ProjectStep {
  id: string; projectId: string; name: string; workDescription: string;
  plannedStart: string; plannedFinish: string;
  actualStart: string | null; actualFinish: string | null; status: StepStatus;
}

export interface ServiceAgreement {
  id: string; name: string; type: string; slaStatus: string;
  startDate: string; endDate: string;
  contractedBalanceQty: number; availableBalanceQty: number; billingBalanceQty: number;
}

export interface License {
  id: string; productId: string; name: string; status: 'Active' | 'Expiring' | 'Expired';
  startDate: string; endDate: string; seats: number; validationKey: string;
}

export interface Product { id: string; name: string; logo: string; vendor: string; }

export interface Subject { id: string; title: string; description: string; }

export interface KnowledgeArticle {
  id: string; title: string; keywords: string[]; contentHtml: string;
  publishOn: string; expirationDate: string; internal: boolean;
  subjectId: string; views: number; helpful: number;
}

export interface Release {
  id: string; requestType: 'Release' | 'Hotfix' | 'Feature' | 'Configuration';
  title: string; name: string; description: string; version: string;
  requestedBy: string; platform: 'Cloud' | 'On-Premise' | 'Mobile' | 'API';
  releaseDate: string; targetCompletionDate: string; productionStatus: ReleaseStatus; status: ReleaseStatus;
  features: string[];
}

export interface Activity {
  id: string; type: 'Email' | 'Call' | 'Task' | 'Meeting' | 'Note';
  subject: string; scheduledStart: string; actualEnd: string | null; read: boolean;
}

export interface SystemComponent {
  id: string; name: string; description: string; version: string;
  stagingStatus: string; productionStatus: string;
  stagingUrl: string; productionUrl: string;
}

// ── Seed data ─────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class MockDataService {

  readonly subjects: Subject[] = [
    { id: 'sub-1', title: 'Platform & Environments', description: 'Production, staging and sandbox environments.' },
    { id: 'sub-2', title: 'Smart Grid Telemetry',    description: 'AMR/AMI ingestion and meter telemetry pipelines.' },
    { id: 'sub-3', title: 'Billing & Settlement',     description: 'Tariff configuration and settlement runs.' },
    { id: 'sub-4', title: 'Identity & Access',         description: 'SSO, MFA, RBAC and SCIM provisioning.' },
    { id: 'sub-5', title: 'Integrations & APIs',       description: 'REST/Webhook integrations and data exports.' },
    { id: 'sub-6', title: 'Reporting & Analytics',     description: 'Dashboards, scheduled reports and BI exports.' },
  ];

  readonly products: Product[] = [
    { id: 'prd-1', name: 'GridIQ',    vendor: 'BlueLink', logo: 'assets/logos/gridiq.png' },
    { id: 'prd-2', name: 'MeterLink', vendor: 'BlueLink', logo: 'assets/logos/meterlink.png' },
    { id: 'prd-3', name: 'FlowOps',   vendor: 'BlueLink', logo: 'assets/logos/flowops.png' },
    { id: 'prd-4', name: 'AssetNav',  vendor: 'BlueLink', logo: 'assets/logos/assetnav.png' },
  ];

  readonly cases = signal<Case[]>([
    { id: 'case-1', ticketNumber: 'BL-10481', title: 'Settlement run BL-04 stalled at 92%',          description: 'Last night\'s settlement run for Region A stalled at 92% with no error.',    priority: 'High',   statusReason: 'On BlueLink', status: 'Active',   responseBy: new Date(Date.now() + 8*3600000).toISOString(),  createdOn: new Date(Date.now() - 2*3600000).toISOString(),   subjectId: 'sub-3', productId: 'prd-1', contact: 'Amelia Brooks' },
    { id: 'case-2', ticketNumber: 'BL-10477', title: 'MeterLink: 312 endpoints reporting NTP drift', description: 'After firmware push, 312 endpoints in Sector 7 show NTP drift > 2s.',          priority: 'Medium', statusReason: 'In Progress',  status: 'Active',   responseBy: new Date(Date.now() + 24*3600000).toISOString(), createdOn: new Date(Date.now() - 6*3600000).toISOString(),   subjectId: 'sub-2', productId: 'prd-2', contact: 'Daniel Okafor' },
    { id: 'case-3', ticketNumber: 'BL-10470', title: 'SSO: SCIM deprovisioning lag for 2 leavers',  description: 'Two leavers still have active sessions in GridIQ despite Entra ID removal.',  priority: 'High',   statusReason: 'On Customer',  status: 'Active',   responseBy: new Date(Date.now() + 4*3600000).toISOString(),  createdOn: new Date(Date.now() - 10*3600000).toISOString(),  subjectId: 'sub-4', productId: 'prd-1', contact: 'Amelia Brooks' },
    { id: 'case-4', ticketNumber: 'BL-10465', title: 'Scheduled BI export fails on Tuesdays',       description: 'Weekly BI export to S3 fails every Tuesday with HTTP 504.',                   priority: 'Medium', statusReason: 'In Progress',  status: 'Active',   responseBy: new Date(Date.now() + 36*3600000).toISOString(), createdOn: new Date(Date.now() - 72*3600000).toISOString(),  subjectId: 'sub-6', productId: 'prd-3', contact: 'Priya Raman' },
    { id: 'case-5', ticketNumber: 'BL-10458', title: 'AssetNav map tiles slow in Sector 4',         description: 'Operators in Sector 4 report 6–8s map tile load times during morning peak.', priority: 'Low',    statusReason: 'New',          status: 'Active',   responseBy: new Date(Date.now() + 48*3600000).toISOString(), createdOn: new Date(Date.now() - 18*3600000).toISOString(),  subjectId: 'sub-1', productId: 'prd-4', contact: 'Marc Lefevre' },
    { id: 'case-6', ticketNumber: 'BL-10433', title: 'Tariff TX-22 settlement variance 0.4%',       description: 'Region B parallel run shows 0.4% variance vs legacy on tariff TX-22.',       priority: 'Medium', statusReason: 'Resolved',     status: 'Resolved', responseBy: new Date(Date.now() - 24*3600000).toISOString(), createdOn: new Date(Date.now() - 96*3600000).toISOString(),  subjectId: 'sub-3', productId: 'prd-1', contact: 'Amelia Brooks' },
  ]);

  readonly caseTimeline: CaseTimeline[] = [
    { id: 'ct-1', caseId: 'case-1', type: 'Customer Reply', description: 'Settlement run BL-04 has been at 92% for two hours. First invoices print at 09:00 UTC.',                                              createdOn: new Date(Date.now() - 2*3600000).toISOString(),    author: 'Amelia Brooks' },
    { id: 'ct-2', caseId: 'case-1', type: 'System Note',    description: 'Auto-routed to Settlement L2 queue. Priority set to High.',                                                                           createdOn: new Date(Date.now() - 2*3600000 + 60000).toISOString(), author: 'BlueLink System' },
    { id: 'ct-3', caseId: 'case-1', type: 'Agent Reply',    description: 'We\'ve picked this up. Trace shows the variance file from TX-22 didn\'t post. Re-driving from last checkpoint — ETA 20 minutes.', createdOn: new Date(Date.now() - 1.5*3600000).toISOString(),  author: 'Karim Y. (BlueLink L2)' },
    { id: 'ct-4', caseId: 'case-1', type: 'Status Change',  description: 'Status changed: "New" → "On BlueLink".',                                                                                               createdOn: new Date(Date.now() - 1.5*3600000 + 60000).toISOString(), author: 'BlueLink System' },
  ];

  readonly projects: Project[] = [
    { id: 'prj-1', name: 'Settlement Module — Phase 2 Rollout', status: 'In Progress', startDate: '2026-02-10', endDate: '2026-08-31', percentCompleted: 62, health: 'On Track', owner: 'BlueLink Delivery — Karim Y.',  description: 'Production rollout of the BlueLink Settlement Module across four Northwind operating regions.' },
    { id: 'prj-2', name: 'Smart Meter Onboarding Wave 3',        status: 'In Progress', startDate: '2026-03-01', endDate: '2026-07-15', percentCompleted: 41, health: 'At Risk',  owner: 'BlueLink Delivery — Sara H.',   description: 'Onboarding 24,000 new smart meters into MeterLink with telemetry validation.' },
    { id: 'prj-3', name: 'Identity Federation (SSO + SCIM)',      status: 'Planning',    startDate: '2026-05-05', endDate: '2026-09-30', percentCompleted: 12, health: 'On Track', owner: 'BlueLink Delivery — Andre P.',  description: 'Federate Northwind Entra ID with GridIQ and FlowOps, with SCIM provisioning.' },
    { id: 'prj-4', name: 'Outage Analytics Lake',                 status: 'On Hold',     startDate: '2026-01-20', endDate: '2026-06-30', percentCompleted: 28, health: 'Off Track', owner: 'BlueLink Delivery — Mei L.',  description: 'Build a curated outage analytics lake fed from SCADA and GridIQ.' },
    { id: 'prj-5', name: 'FlowOps DR Failover Drill',             status: 'Completed',   startDate: '2026-01-08', endDate: '2026-02-05', percentCompleted: 100, health: 'On Track', owner: 'BlueLink Delivery — Karim Y.', description: 'Annual DR failover drill of FlowOps environment with RPO/RTO validation.' },
  ];

  readonly projectSteps: ProjectStep[] = [
    { id: 'ps-1', projectId: 'prj-1', name: 'Discovery & Region Scoping',  workDescription: 'Confirm tariff variants per region.',              plannedStart: '2026-02-10', plannedFinish: '2026-02-28', actualStart: '2026-02-10', actualFinish: '2026-02-27', status: 'Completed' },
    { id: 'ps-2', projectId: 'prj-1', name: 'Data Migration Build',         workDescription: 'Build region-specific ETL packages.',              plannedStart: '2026-03-01', plannedFinish: '2026-04-15', actualStart: '2026-03-01', actualFinish: '2026-04-22', status: 'Completed' },
    { id: 'ps-3', projectId: 'prj-1', name: 'Parallel Run — Region A',      workDescription: 'Operate legacy + Settlement Module in parallel.',  plannedStart: '2026-04-20', plannedFinish: '2026-05-25', actualStart: '2026-04-23', actualFinish: null,         status: 'In Progress' },
    { id: 'ps-4', projectId: 'prj-1', name: 'Operator Training & Go-Live A', workDescription: 'Deliver 4 operator training cohorts.',            plannedStart: '2026-05-26', plannedFinish: '2026-06-15', actualStart: null,         actualFinish: null,         status: 'Not Started' },
    { id: 'ps-5', projectId: 'prj-1', name: 'Regions B/C/D Rollout',        workDescription: 'Sequenced rollout across remaining regions.',      plannedStart: '2026-06-16', plannedFinish: '2026-08-20', actualStart: null,         actualFinish: null,         status: 'Not Started' },
    { id: 'ps-7', projectId: 'prj-2', name: 'Field Survey & Asset Tagging',  workDescription: 'Geo-tag and asset-register all 24,000 endpoints.', plannedStart: '2026-03-01', plannedFinish: '2026-03-28', actualStart: '2026-03-02', actualFinish: '2026-04-04', status: 'Delayed' },
    { id: 'ps-8', projectId: 'prj-2', name: 'MeterLink Telemetry Validation', workDescription: 'Validate ingestion and exception flows.',        plannedStart: '2026-03-29', plannedFinish: '2026-05-01', actualStart: '2026-04-05', actualFinish: null,         status: 'In Progress' },
  ];

  readonly serviceAgreements: ServiceAgreement[] = [
    { id: 'sa-1', name: 'Platinum Managed Services Retainer', type: 'Retainer',    slaStatus: 'Within SLA', startDate: '2026-01-01', endDate: '2026-12-31', contractedBalanceQty: 480, availableBalanceQty: 286, billingBalanceQty: 194 },
    { id: 'sa-2', name: 'GridIQ Quarterly Block Hours',        type: 'Block Hours', slaStatus: 'At Risk',    startDate: '2026-04-01', endDate: '2026-06-30', contractedBalanceQty: 120, availableBalanceQty: 22,  billingBalanceQty: 98 },
    { id: 'sa-3', name: 'MeterLink Production Subscription',   type: 'Subscription', slaStatus: 'Within SLA', startDate: '2025-09-15', endDate: '2026-09-14', contractedBalanceQty: 1,   availableBalanceQty: 1,   billingBalanceQty: 0 },
    { id: 'sa-4', name: 'Settlement Module Implementation SOW', type: 'Project SOW', slaStatus: 'Within SLA', startDate: '2026-02-10', endDate: '2026-08-31', contractedBalanceQty: 640, availableBalanceQty: 412, billingBalanceQty: 228 },
  ];

  readonly licenses: License[] = [
    { id: 'lic-1', productId: 'prd-1', name: 'GridIQ Enterprise — Production',    status: 'Active',   startDate: '2025-09-15', endDate: '2026-09-14', seats: 250, validationKey: 'GRDQ-7K3M-9P4N-A8F2-1234' },
    { id: 'lic-2', productId: 'prd-2', name: 'MeterLink Telemetry — Production',  status: 'Active',   startDate: '2025-09-15', endDate: '2026-09-14', seats: 60,  validationKey: 'MLNK-2X8Q-7T1V-B6Z9-5678' },
    { id: 'lic-3', productId: 'prd-3', name: 'FlowOps Automation — Production',   status: 'Expiring', startDate: '2025-05-20', endDate: '2026-05-19', seats: 40,  validationKey: 'FLOP-9D4H-6W2K-C3J7-9012' },
    { id: 'lic-4', productId: 'prd-4', name: 'AssetNav Field — Production',       status: 'Active',   startDate: '2026-01-12', endDate: '2027-01-11', seats: 120, validationKey: 'ASNV-5R1P-8L0Y-D2M4-3456' },
    { id: 'lic-5', productId: 'prd-1', name: 'GridIQ Sandbox',                    status: 'Expiring', startDate: '2025-05-20', endDate: '2026-05-12', seats: 25,  validationKey: 'GRDQ-S1B2-N0X8-E7K3-7890' },
  ];

  readonly activities: Activity[] = [
    { id: 'act-1', type: 'Email',   subject: 'Re: BL-10481 Settlement run stalled at 92%',     scheduledStart: new Date(Date.now() - 1.5*3600000).toISOString(), actualEnd: new Date(Date.now() - 1.5*3600000).toISOString(), read: false },
    { id: 'act-2', type: 'Meeting', subject: 'Settlement Phase 2 — Region A go-live readiness', scheduledStart: new Date(Date.now() + 2*3600000).toISOString(),   actualEnd: null, read: false },
    { id: 'act-3', type: 'Task',    subject: 'Approve SCIM deprovisioning runbook v1.2',         scheduledStart: new Date(Date.now() + 4*3600000).toISOString(),   actualEnd: null, read: true },
    { id: 'act-4', type: 'Call',    subject: 'Weekly delivery sync with BlueLink',               scheduledStart: new Date(Date.now() + 24*3600000).toISOString(),  actualEnd: null, read: true },
    { id: 'act-5', type: 'Note',    subject: 'MeterLink Wave 3 — variance in Sector 7',         scheduledStart: new Date(Date.now() - 6*3600000).toISOString(),   actualEnd: new Date(Date.now() - 6*3600000).toISOString(), read: true },
    { id: 'act-6', type: 'Email',   subject: 'Release notes: GridIQ 4.18.0 (Staged 2026-05-04)', scheduledStart: new Date(Date.now() - 12*3600000).toISOString(), actualEnd: new Date(Date.now() - 12*3600000).toISOString(), read: true },
  ];

  readonly knowledgeArticles: KnowledgeArticle[] = [
    { id: 'ka-1', title: 'How settlement runs are checkpointed and re-driven', keywords: ['settlement','run','checkpoint'], publishOn: '2026-01-12', expirationDate: '2027-01-12', internal: false, subjectId: 'sub-3', views: 1248, helpful: 96, contentHtml: `<p>Every settlement run is decomposed into <strong>checkpointed stages</strong>. If a stage fails the run pauses rather than aborts.</p><h3>Inspecting the active checkpoint</h3><p>Open <strong>GridIQ → Settlement → Runs</strong> and select the run. The Stage Ledger panel lists every stage with its checkpoint hash and completion percentage.</p><h3>Safe re-drive procedure</h3><ol><li>Confirm the stalled stage in the Stage Ledger.</li><li>Verify the missing input file is present in the inbound bucket.</li><li>Click <strong>Re-drive from checkpoint</strong>.</li></ol>` },
    { id: 'ka-2', title: 'MeterLink: diagnosing NTP drift on a sector',          keywords: ['meterlink','ntp','drift'],     publishOn: '2026-02-04', expirationDate: '2027-02-04', internal: false, subjectId: 'sub-2', views: 612,  helpful: 73, contentHtml: `<p>NTP drift usually signals a firmware mismatch on a subset of endpoints.</p><h3>Quick checks</h3><ul><li>Open <strong>MeterLink → Telemetry → Sector view</strong>, set the drift filter to <code>&gt; 1s</code>.</li><li>Group by Firmware version — outliers cluster on a single version.</li></ul>` },
    { id: 'ka-3', title: 'Federating Entra ID with GridIQ (SSO + SCIM)',         keywords: ['sso','scim','entra'],          publishOn: '2026-03-01', expirationDate: '2027-03-01', internal: false, subjectId: 'sub-4', views: 894,  helpful: 81, contentHtml: `<p>BlueLink GridIQ supports SAML 2.0 federation with Entra ID and SCIM 2.0 for provisioning.</p><h3>Step 1 — Create the enterprise application</h3><p>In Entra ID, create a new non-gallery enterprise application named <em>BlueLink GridIQ</em>.</p>` },
    { id: 'ka-4', title: 'Scheduling BI exports to your S3 bucket',              keywords: ['bi','export','s3'],           publishOn: '2026-01-28', expirationDate: '2027-01-28', internal: false, subjectId: 'sub-6', views: 421,  helpful: 39, contentHtml: `<p>BlueLink can deliver BI exports directly to your own S3 bucket on a schedule.</p><h3>Configuring the destination</h3><p>Open <strong>FlowOps → Integrations → S3 destinations</strong>, add the bucket name and the role ARN, then click Test write.</p>` },
    { id: 'ka-5', title: 'AssetNav: improving map performance in dispatch',      keywords: ['assetnav','map','tiles'],      publishOn: '2026-04-05', expirationDate: '2027-04-05', internal: false, subjectId: 'sub-1', views: 188,  helpful: 22, contentHtml: `<p>Dispatch operators occasionally see slow map tile loads during morning peak.</p><h3>Recommendations</h3><ol><li>Limit active overlays to no more than 4 layers per view.</li><li>Schedule a daily cache invalidation in <strong>AssetNav → Settings → Map Cache</strong>.</li></ol>` },
    { id: 'ka-6', title: 'Webhook signing: rotating your shared secret',         keywords: ['webhook','hmac','secret'],     publishOn: '2026-04-12', expirationDate: '2027-04-12', internal: false, subjectId: 'sub-5', views: 305,  helpful: 41, contentHtml: `<p>BlueLink signs every outbound webhook with HMAC-SHA256 over the raw request body.</p><h3>Rotation procedure</h3><ol><li>Generate a new secret in <strong>FlowOps → Integrations → Webhooks → Secrets</strong>.</li><li>Add it as a secondary secret on your receiver.</li><li>Promote the new secret to primary after 24 h.</li></ol>` },
  ];

  readonly releases: Release[] = [
    { id: 'rel-1', requestType: 'Release',       title: 'GridIQ 4.18.0 — Improved settlement re-drive UX',  name: 'GridIQ 4.18.0',   description: 'Operator-facing re-drive panel with checkpoint diff.',               version: '4.18.0',     requestedBy: 'BlueLink Product',   platform: 'Cloud',      releaseDate: '2026-05-04', targetCompletionDate: '2026-05-04', productionStatus: 'Staged',       status: 'Staged',       features: ['Checkpoint diff', 'Operator panel improvements'] },
    { id: 'rel-2', requestType: 'Hotfix',        title: 'FlowOps 4.12.1 — Webhook signature edge case',     name: 'FlowOps 4.12.1',  description: 'Hotfix for HMAC verification failing with trailing newlines.',     version: '4.12.1',     requestedBy: 'Northwind Energy',   platform: 'API',        releaseDate: '2026-04-30', targetCompletionDate: '2026-04-30', productionStatus: 'QA',            status: 'QA',            features: ['HMAC newline fix', 'Ingress validation'] },
    { id: 'rel-3', requestType: 'Feature',       title: 'MeterLink — Per-sector NTP drift report',           name: 'MeterLink NTP report', description: 'Scheduled CSV/PDF report of NTP drift outliers.',                 version: '2.10.0',     requestedBy: 'Northwind Energy',   platform: 'Mobile',     releaseDate: '2026-06-10', targetCompletionDate: '2026-06-10', productionStatus: 'In Development', status: 'In Development', features: ['NTP drift report', 'PDF export'] },
    { id: 'rel-4', requestType: 'Feature',       title: 'AssetNav — Offline tile bundles for Sector 4',     name: 'AssetNav offline bundles', description: 'Allow dispatchers to pre-cache up to 200 MB of map tiles.',       version: '1.7.0',      requestedBy: 'Northwind Energy',   platform: 'On-Premise', releaseDate: '2026-07-01', targetCompletionDate: '2026-07-01', productionStatus: 'Planned',       status: 'Planned',       features: ['Tile pre-cache', 'Offline bundle manager'] },
    { id: 'rel-5', requestType: 'Configuration', title: 'GridIQ — Tariff TX-22 variance threshold tuning',  name: 'GridIQ tariff tuning', description: 'Tighten variance threshold from 0.5% to 0.25%.',                  version: 'cfg-2026.04', requestedBy: 'Northwind Energy',   platform: 'Cloud',      releaseDate: '2026-05-12', targetCompletionDate: '2026-05-12', productionStatus: 'Planned',       status: 'Planned',       features: ['Threshold tuning'] },
    { id: 'rel-6', requestType: 'Release',       title: 'Settlement Module 3.2.0 GA',                       name: 'Settlement Module 3.2.0', description: 'General availability release covering Phase 2 scope.',           version: '3.2.0',      requestedBy: 'BlueLink Product',   platform: 'On-Premise', releaseDate: '2026-08-25', targetCompletionDate: '2026-08-25', productionStatus: 'In Development', status: 'In Development', features: ['GA release', 'Phase 2 delivery'] },
    { id: 'rel-7', requestType: 'Release',       title: 'GridIQ 4.17.3 — Caching fix',                      name: 'GridIQ 4.17.3',  description: 'Fixes dashboard widget caching reported in BL-10376.',          version: '4.17.3',     requestedBy: 'BlueLink Product',   platform: 'Cloud',      releaseDate: '2026-04-15', targetCompletionDate: '2026-04-15', productionStatus: 'Released',     status: 'Released',     features: ['Widget cache fix'] },
  ];

  readonly systemComponents: SystemComponent[] = [
    { id: 'sc-1', name: 'GridIQ Web',              description: 'Operator console and dashboards.', version: '4.17.3', stagingStatus: 'Healthy',     productionStatus: 'Healthy',  stagingUrl: 'https://gridiq-stg.northwind.bluelink.app',    productionUrl: 'https://gridiq.northwind.bluelink.app' },
    { id: 'sc-2', name: 'MeterLink Ingest',         description: 'Telemetry ingestion pipeline.',   version: '2.9.1',  stagingStatus: 'Healthy',     productionStatus: 'Degraded', stagingUrl: 'https://meterlink-stg.northwind.bluelink.app', productionUrl: 'https://meterlink.northwind.bluelink.app' },
    { id: 'sc-3', name: 'FlowOps Workflow Engine',  description: 'Workflow orchestration.',          version: '4.12.0', stagingStatus: 'Healthy',     productionStatus: 'Healthy',  stagingUrl: 'https://flowops-stg.northwind.bluelink.app',   productionUrl: 'https://flowops.northwind.bluelink.app' },
    { id: 'sc-4', name: 'AssetNav',                 description: 'Field asset & dispatch map.',     version: '1.6.2',  stagingStatus: 'Maintenance', productionStatus: 'Healthy',  stagingUrl: 'https://assetnav-stg.northwind.bluelink.app',  productionUrl: 'https://assetnav.northwind.bluelink.app' },
    { id: 'sc-5', name: 'Settlement Module',        description: 'Tariff & settlement engine.',     version: '3.2.0-rc4', stagingStatus: 'Healthy',  productionStatus: 'Healthy',  stagingUrl: 'https://settlement-stg.northwind.bluelink.app', productionUrl: 'https://settlement.northwind.bluelink.app' },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
  }

  formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('en-GB', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  relativeTime(iso: string): string {
    const diff = new Date(iso).getTime() - Date.now();
    const abs  = Math.abs(diff);
    const past = diff < 0;
    const h = 3600000; const d = 24 * h;
    let v: string;
    if (abs < h)   v = `${Math.max(1, Math.round(abs / 60000))} min`;
    else if (abs < d) v = `${Math.round(abs / h)} h`;
    else           v = `${Math.round(abs / d)} d`;
    return past ? `${v} ago` : `in ${v}`;
  }

  maskKey(key: string, revealLast = 4): string {
    return key.slice(0, -revealLast).replace(/[A-Za-z0-9]/g, 'X') + key.slice(-revealLast);
  }

  expiringLicenses(windowDays = 30): License[] {
    const now = Date.now();
    return this.licenses.filter(l => {
      const days = (new Date(l.endDate).getTime() - now) / 86400000;
      return days <= windowDays && l.status !== 'Expired';
    });
  }
}