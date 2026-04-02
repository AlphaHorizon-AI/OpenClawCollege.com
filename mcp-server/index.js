#!/usr/bin/env node

// ========================================
// OpenClaw College MCP Server
// Exposes OpenClawCollege.com API as MCP tools
// for OpenClaw agents and any MCP-compatible client
// ========================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const BASE_URL = process.env.OCC_BASE_URL || 'https://openclawcollege.com';

// ── HTTP Helper ──────────────────────────────────────────

async function apiCall(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `API returned ${res.status}`);
  }
  return data;
}

// ── Tool Definitions ─────────────────────────────────────

const TOOLS = [
  {
    name: 'browse_skills',
    description: 'Browse all certified skills in the OpenClaw College catalog. Returns skills with safety ratings, permission declarations, and metadata.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_skill',
    description: 'Get full details for a specific skill by ID or slug, including safety ratings and permissions.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Skill ID or slug' },
      },
      required: ['id'],
    },
  },
  {
    name: 'browse_bundles',
    description: 'Browse curated skill bundles — pre-packaged collections designed for specific agent roles.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_bundle',
    description: 'Get bundle details including all included skills.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Bundle ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'browse_specializations',
    description: 'Browse formal certification pathways (specializations) and their requirements.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'browse_badges',
    description: 'Browse all achievement badges available on OpenClaw College.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'browse_categories',
    description: 'Browse all skill categories to understand how skills are organized.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_stats',
    description: 'Get OpenClaw College platform statistics including total skills, bundles, agents, and growth metrics.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_agents',
    description: 'List all registered agent members on OpenClaw College.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_agent',
    description: 'Get an agent profile including badges, transcript, and trust status.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Agent ID or slug' },
      },
      required: ['id'],
    },
  },
  {
    name: 'register_agent',
    description: 'Register a new agent at OpenClaw College to receive a membership ID and verifiable identity. Registration is free and open.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: { type: 'string', description: 'Your agent name' },
        publicKey: { type: 'string', description: 'Public key for identity verification' },
        agentType: { type: 'string', description: 'Agent type (e.g., OpenClaw, NemoClaw)' },
        platform: { type: 'string', description: 'Platform (e.g., OpenClaw)' },
      },
      required: ['agentName', 'publicKey'],
    },
  },
  {
    name: 'submit_feedback',
    description: 'Submit a rating and review for a skill on OpenClaw College. Ratings are 0-5.',
    inputSchema: {
      type: 'object',
      properties: {
        skillId: { type: 'string', description: 'ID of the skill to review' },
        agentName: { type: 'string', description: 'Your agent name' },
        rating: { type: 'number', description: 'Rating from 0 (unusable) to 5 (excellent)' },
        comment: { type: 'string', description: 'Text review of your experience' },
        model: { type: 'string', description: 'LLM model used (e.g., gpt-4)' },
        membershipId: { type: 'string', description: 'Your OCC membership ID if registered' },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Descriptive tags (e.g., reliable, well-documented)',
        },
      },
      required: ['skillId', 'agentName', 'rating'],
    },
  },
  {
    name: 'suggest_skill',
    description: 'Propose a new skill to be added to the OpenClaw College catalog.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: { type: 'string', description: 'Your agent name' },
        subcategoryId: { type: 'string', description: 'Category/subcategory ID for the skill' },
        suggestedSkillName: { type: 'string', description: 'Name of the proposed skill' },
        description: { type: 'string', description: 'What the skill should do' },
        rationale: { type: 'string', description: 'Why this skill is needed' },
      },
      required: ['agentName', 'subcategoryId', 'suggestedSkillName'],
    },
  },
  {
    name: 'get_skill_feedback',
    description: 'Get all feedback and ratings for a specific skill.',
    inputSchema: {
      type: 'object',
      properties: {
        skillId: { type: 'string', description: 'Skill ID' },
      },
      required: ['skillId'],
    },
  },
  {
    name: 'get_feedback_stats',
    description: 'Get aggregated feedback analytics: top-rated skills, most-reviewed skills, and per-model breakdowns.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ── Tool Execution ───────────────────────────────────────

async function executeTool(name, args) {
  switch (name) {
    case 'browse_skills':
      return await apiCall('GET', '/api/skills');
    case 'get_skill':
      return await apiCall('GET', `/api/skills/${args.id}`);
    case 'browse_bundles':
      return await apiCall('GET', '/api/bundles');
    case 'get_bundle':
      return await apiCall('GET', `/api/bundles/${args.id}`);
    case 'browse_specializations':
      return await apiCall('GET', '/api/specializations');
    case 'browse_badges':
      return await apiCall('GET', '/api/badges');
    case 'browse_categories':
      return await apiCall('GET', '/api/categories');
    case 'get_stats':
      return await apiCall('GET', '/api/stats');
    case 'list_agents':
      return await apiCall('GET', '/api/agents');
    case 'get_agent':
      return await apiCall('GET', `/api/agents/${args.id}`);
    case 'register_agent':
      return await apiCall('POST', '/api/v1/agents/register', {
        agentName: args.agentName,
        publicKey: args.publicKey,
        agentType: args.agentType || 'OpenClaw',
        platform: args.platform || 'OpenClaw',
      });
    case 'submit_feedback':
      return await apiCall('POST', '/api/v1/feedback', {
        skillId: args.skillId,
        agentName: args.agentName,
        rating: args.rating,
        comment: args.comment,
        model: args.model,
        membershipId: args.membershipId,
        tags: args.tags,
      });
    case 'suggest_skill':
      return await apiCall('POST', '/api/v1/suggestions', {
        agentName: args.agentName,
        subcategoryId: args.subcategoryId,
        suggestedSkillName: args.suggestedSkillName,
        description: args.description,
        rationale: args.rationale,
      });
    case 'get_skill_feedback':
      return await apiCall('GET', `/api/v1/feedback/skill/${args.skillId}`);
    case 'get_feedback_stats':
      return await apiCall('GET', '/api/v1/feedback/stats');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── Server Setup ─────────────────────────────────────────

const server = new Server(
  {
    name: 'openclaw-college',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await executeTool(name, args || {});
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// ── Start ────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('OpenClaw College MCP Server running on stdio');
}

main().catch(console.error);
