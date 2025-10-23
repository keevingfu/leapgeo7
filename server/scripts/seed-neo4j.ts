import neo4j, { Driver } from 'neo4j-driver';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

interface PromptData {
  id: string;
  text: string;
  pLevel: string;
  score: number;
  month: string;
  geoIntent: string;
}

interface ContentData {
  id: string;
  title: string;
  channel: string;
  publishStatus: string;
  url: string;
}

interface RelationData {
  prompt1: string;
  prompt2: string;
  weight: number;
}

interface CoverageData {
  promptId: string;
  contentId: string;
}

// Test data: 20 prompts across different P-levels
const prompts: PromptData[] = [
  // P0 prompts (highest priority)
  { id: 'p0-001', text: 'best mattress for back pain relief', pLevel: 'P0', score: 95.5, month: '2025-01', geoIntent: 'transactional' },
  { id: 'p0-002', text: 'memory foam vs hybrid mattress comparison', pLevel: 'P0', score: 92.3, month: '2025-01', geoIntent: 'informational' },
  { id: 'p0-003', text: 'mattress firmness guide for side sleepers', pLevel: 'P0', score: 89.7, month: '2025-01', geoIntent: 'informational' },
  { id: 'p0-004', text: 'cooling mattress for hot sleepers', pLevel: 'P0', score: 91.2, month: '2025-01', geoIntent: 'transactional' },

  // P1 prompts (important)
  { id: 'p1-001', text: 'mattress for couples with different firmness preferences', pLevel: 'P1', score: 85.4, month: '2025-01', geoIntent: 'informational' },
  { id: 'p1-002', text: 'organic mattress benefits and certifications', pLevel: 'P1', score: 83.8, month: '2025-02', geoIntent: 'informational' },
  { id: 'p1-003', text: 'mattress warranty and return policy comparison', pLevel: 'P1', score: 82.1, month: '2025-02', geoIntent: 'commercial' },
  { id: 'p1-004', text: 'mattress for heavy people over 250 lbs', pLevel: 'P1', score: 86.9, month: '2025-02', geoIntent: 'transactional' },
  { id: 'p1-005', text: 'latex vs memory foam mattress pros and cons', pLevel: 'P1', score: 84.2, month: '2025-02', geoIntent: 'informational' },

  // P2 prompts (opportunity)
  { id: 'p2-001', text: 'mattress topper vs new mattress cost comparison', pLevel: 'P2', score: 72.5, month: '2025-03', geoIntent: 'commercial' },
  { id: 'p2-002', text: 'mattress cleaning and maintenance tips', pLevel: 'P2', score: 68.9, month: '2025-03', geoIntent: 'informational' },
  { id: 'p2-003', text: 'mattress disposal and recycling options', pLevel: 'P2', score: 65.3, month: '2025-03', geoIntent: 'informational' },
  { id: 'p2-004', text: 'adjustable base compatibility with mattress', pLevel: 'P2', score: 70.8, month: '2025-03', geoIntent: 'informational' },
  { id: 'p2-005', text: 'mattress trial period and sleep test reviews', pLevel: 'P2', score: 74.1, month: '2025-03', geoIntent: 'commercial' },

  // P3 prompts (reserve)
  { id: 'p3-001', text: 'history of mattress manufacturing evolution', pLevel: 'P3', score: 45.2, month: '2025-04', geoIntent: 'informational' },
  { id: 'p3-002', text: 'mattress industry trends and statistics 2025', pLevel: 'P3', score: 48.7, month: '2025-04', geoIntent: 'informational' },
  { id: 'p3-003', text: 'mattress compression and shipping technology', pLevel: 'P3', score: 42.1, month: '2025-04', geoIntent: 'informational' },
  { id: 'p3-004', text: 'mattress flame retardant regulations explained', pLevel: 'P3', score: 39.8, month: '2025-04', geoIntent: 'informational' },
  { id: 'p3-005', text: 'mattress coil count and spring system types', pLevel: 'P3', score: 44.5, month: '2025-04', geoIntent: 'informational' },
];

// Test data: 10 content pieces
const contents: ContentData[] = [
  { id: 'cnt-001', title: 'Ultimate Guide to Back Pain Relief Mattresses', channel: 'Blog', publishStatus: 'published', url: 'https://sweetnight.com/blog/back-pain-mattress' },
  { id: 'cnt-002', title: 'Memory Foam vs Hybrid: Which is Right for You?', channel: 'YouTube', publishStatus: 'published', url: 'https://youtube.com/watch?v=abc123' },
  { id: 'cnt-003', title: 'Firmness Guide for Side Sleepers [Infographic]', channel: 'Reddit', publishStatus: 'published', url: 'https://reddit.com/r/mattress/comments/xyz' },
  { id: 'cnt-004', title: 'Cooling Mattress Technology Explained', channel: 'Medium', publishStatus: 'published', url: 'https://medium.com/@sweetnight/cooling-tech' },
  { id: 'cnt-005', title: 'Couples Mattress Guide: Split Firmness Solutions', channel: 'Quora', publishStatus: 'published', url: 'https://quora.com/answer/couples-mattress' },
  { id: 'cnt-006', title: 'Organic Mattress Certifications: What to Look For', channel: 'Blog', publishStatus: 'draft', url: '' },
  { id: 'cnt-007', title: 'Mattress Warranty Comparison: Top 10 Brands', channel: 'Amazon', publishStatus: 'published', url: 'https://amazon.com/sweetnight-review' },
  { id: 'cnt-008', title: 'Heavy Sleepers Guide: Mattresses with Extra Support', channel: 'LinkedIn', publishStatus: 'published', url: 'https://linkedin.com/pulse/heavy-sleepers' },
  { id: 'cnt-009', title: 'Latex vs Memory Foam: Pros and Cons Breakdown', channel: 'Blog', publishStatus: 'published', url: 'https://sweetnight.com/blog/latex-vs-foam' },
  { id: 'cnt-010', title: 'Mattress Topper or New Mattress? Cost Analysis', channel: 'Reddit', publishStatus: 'draft', url: '' },
];

// Test data: Prompt-to-Content coverage relationships
const coverages: CoverageData[] = [
  { promptId: 'p0-001', contentId: 'cnt-001' },
  { promptId: 'p0-002', contentId: 'cnt-002' },
  { promptId: 'p0-003', contentId: 'cnt-003' },
  { promptId: 'p0-004', contentId: 'cnt-004' },
  { promptId: 'p1-001', contentId: 'cnt-005' },
  { promptId: 'p1-002', contentId: 'cnt-006' },
  { promptId: 'p1-003', contentId: 'cnt-007' },
  { promptId: 'p1-004', contentId: 'cnt-008' },
  { promptId: 'p1-005', contentId: 'cnt-009' },
  { promptId: 'p2-001', contentId: 'cnt-010' },
];

// Test data: Prompt-to-Prompt relationships (semantic connections)
const relations: RelationData[] = [
  { prompt1: 'p0-001', prompt2: 'p0-003', weight: 0.85 }, // back pain <-> firmness guide
  { prompt1: 'p0-001', prompt2: 'p1-004', weight: 0.72 }, // back pain <-> heavy sleepers
  { prompt1: 'p0-002', prompt2: 'p1-005', weight: 0.90 }, // memory foam vs hybrid <-> latex vs foam
  { prompt1: 'p0-003', prompt2: 'p1-001', weight: 0.68 }, // side sleepers <-> couples
  { prompt1: 'p0-004', prompt2: 'p2-004', weight: 0.55 }, // cooling <-> adjustable base
  { prompt1: 'p1-001', prompt2: 'p1-004', weight: 0.62 }, // couples <-> heavy people
  { prompt1: 'p1-002', prompt2: 'p3-004', weight: 0.70 }, // organic <-> flame retardant
  { prompt1: 'p1-003', prompt2: 'p2-005', weight: 0.78 }, // warranty <-> trial period
  { prompt1: 'p2-001', prompt2: 'p2-002', weight: 0.65 }, // topper <-> maintenance
  { prompt1: 'p2-002', prompt2: 'p2-003', weight: 0.72 }, // maintenance <-> disposal
  { prompt1: 'p3-001', prompt2: 'p3-002', weight: 0.80 }, // history <-> trends
  { prompt1: 'p3-002', prompt2: 'p3-003', weight: 0.75 }, // trends <-> shipping tech
];

async function seedNeo4j() {
  const uri = process.env.NEO4J_URI || 'neo4j://localhost:7688';
  const username = process.env.NEO4J_USERNAME || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';

  console.log(`Connecting to Neo4j at ${uri}...`);
  const driver: Driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

  try {
    await driver.verifyConnectivity();
    console.log('✅ Connected to Neo4j\n');

    const session = driver.session();

    try {
      // Step 1: Clear existing data
      console.log('🗑️  Clearing existing data...');
      await session.run('MATCH (n) DETACH DELETE n');
      console.log('✅ Cleared all nodes and relationships\n');

      // Step 2: Create Prompt nodes
      console.log(`📊 Creating ${prompts.length} Prompt nodes...`);
      for (const prompt of prompts) {
        await session.run(
          `
          CREATE (p:Prompt {
            id: $id,
            text: $text,
            pLevel: $pLevel,
            score: $score,
            month: $month,
            geoIntent: $geoIntent,
            createdAt: datetime()
          })
          `,
          prompt
        );
      }
      console.log(`✅ Created ${prompts.length} Prompt nodes\n`);

      // Step 3: Create Content nodes
      console.log(`📝 Creating ${contents.length} Content nodes...`);
      for (const content of contents) {
        await session.run(
          `
          CREATE (c:Content {
            id: $id,
            title: $title,
            channel: $channel,
            publishStatus: $publishStatus,
            url: $url,
            createdAt: datetime()
          })
          `,
          content
        );
      }
      console.log(`✅ Created ${contents.length} Content nodes\n`);

      // Step 4: Create COVERED_BY relationships
      console.log(`🔗 Creating ${coverages.length} COVERED_BY relationships...`);
      for (const coverage of coverages) {
        await session.run(
          `
          MATCH (p:Prompt {id: $promptId})
          MATCH (c:Content {id: $contentId})
          CREATE (p)-[:COVERED_BY]->(c)
          `,
          coverage
        );
      }
      console.log(`✅ Created ${coverages.length} COVERED_BY relationships\n`);

      // Step 5: Create RELATES_TO relationships (bidirectional via two queries)
      console.log(`🔗 Creating ${relations.length} RELATES_TO relationships...`);
      for (const relation of relations) {
        await session.run(
          `
          MATCH (p1:Prompt {id: $prompt1})
          MATCH (p2:Prompt {id: $prompt2})
          CREATE (p1)-[:RELATES_TO {weight: $weight}]->(p2)
          CREATE (p2)-[:RELATES_TO {weight: $weight}]->(p1)
          `,
          relation
        );
      }
      console.log(`✅ Created ${relations.length} RELATES_TO relationships\n`);

      // Step 6: Verify data
      console.log('🔍 Verifying data...');
      const stats = await session.run(`
        MATCH (p:Prompt)
        OPTIONAL MATCH (p)-[:COVERED_BY]->(c:Content)
        OPTIONAL MATCH (p)-[r:RELATES_TO]-(related:Prompt)
        RETURN
          count(DISTINCT p) as totalPrompts,
          count(DISTINCT c) as totalContent,
          count(DISTINCT CASE WHEN c IS NOT NULL THEN p END) as coveredPrompts,
          count(DISTINCT r) as totalRelations
      `);

      const record = stats.records[0];
      console.log('📈 Database Statistics:');
      console.log(`   Total Prompts: ${record.get('totalPrompts').toNumber()}`);
      console.log(`   Total Content: ${record.get('totalContent').toNumber()}`);
      console.log(`   Covered Prompts: ${record.get('coveredPrompts').toNumber()}`);
      console.log(`   Total Relations: ${record.get('totalRelations').toNumber()}`);

      const coverageRate = (record.get('coveredPrompts').toNumber() / record.get('totalPrompts').toNumber()) * 100;
      console.log(`   Coverage Rate: ${coverageRate.toFixed(1)}%\n`);

      console.log('✅ Neo4j seeding completed successfully!');
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('❌ Error seeding Neo4j:', error);
    throw error;
  } finally {
    await driver.close();
  }
}

// Run the seeding script
seedNeo4j()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
