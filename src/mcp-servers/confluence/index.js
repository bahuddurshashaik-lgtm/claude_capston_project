#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Confluence configuration
const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL || 'https://bahuddurshashaik.atlassian.net/wiki';
const CONFLUENCE_EMAIL = process.env.CONFLUENCE_EMAIL;
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY || 'ClaudeCpas';

// Create axios instance with auth
const confluenceApi = axios.create({
  baseURL: `${CONFLUENCE_BASE_URL}/rest/api`,
  auth: {
    username: CONFLUENCE_EMAIL,
    password: CONFLUENCE_API_TOKEN,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Create MCP server
const server = new Server(
  {
    name: 'confluence-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'confluence_create_page',
        description: 'Create a new page in Confluence',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Page title',
            },
            content: {
              type: 'string',
              description: 'Page content in Confluence storage format (HTML-like)',
            },
            spaceKey: {
              type: 'string',
              description: 'Confluence space key (optional, defaults to ClaudeCpas)',
            },
            parentId: {
              type: 'string',
              description: 'Parent page ID (optional)',
            },
          },
          required: ['title', 'content'],
        },
      },
      {
        name: 'confluence_get_page',
        description: 'Get a Confluence page by ID or title',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: 'Page ID',
            },
            title: {
              type: 'string',
              description: 'Page title',
            },
            spaceKey: {
              type: 'string',
              description: 'Confluence space key (optional, defaults to ClaudeCpas)',
            },
          },
        },
      },
      {
        name: 'confluence_update_page',
        description: 'Update an existing Confluence page',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: 'Page ID',
            },
            title: {
              type: 'string',
              description: 'New page title',
            },
            content: {
              type: 'string',
              description: 'New page content in Confluence storage format',
            },
            version: {
              type: 'number',
              description: 'Current page version number',
            },
          },
          required: ['pageId', 'title', 'content', 'version'],
        },
      },
      {
        name: 'confluence_search',
        description: 'Search for pages in Confluence',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (CQL)',
            },
            spaceKey: {
              type: 'string',
              description: 'Confluence space key (optional, defaults to ClaudeCpas)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 10)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'confluence_list_pages',
        description: 'List all pages in a Confluence space',
        inputSchema: {
          type: 'object',
          properties: {
            spaceKey: {
              type: 'string',
              description: 'Confluence space key (optional, defaults to ClaudeCpas)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 25)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'confluence_create_page': {
        const spaceKey = args.spaceKey || CONFLUENCE_SPACE_KEY;
        const pageData = {
          type: 'page',
          title: args.title,
          space: { key: spaceKey },
          body: {
            storage: {
              value: args.content,
              representation: 'storage',
            },
          },
        };

        if (args.parentId) {
          pageData.ancestors = [{ id: args.parentId }];
        }

        const response = await confluenceApi.post('/content', pageData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'confluence_get_page': {
        let response;
        if (args.pageId) {
          response = await confluenceApi.get(`/content/${args.pageId}`, {
            params: { expand: 'body.storage,version' },
          });
        } else if (args.title) {
          const spaceKey = args.spaceKey || CONFLUENCE_SPACE_KEY;
          const searchResponse = await confluenceApi.get('/content', {
            params: {
              spaceKey,
              title: args.title,
              expand: 'body.storage,version',
            },
          });
          if (searchResponse.data.results.length === 0) {
            throw new Error(`Page with title "${args.title}" not found`);
          }
          response = { data: searchResponse.data.results[0] };
        } else {
          throw new Error('Either pageId or title must be provided');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'confluence_update_page': {
        const pageData = {
          version: { number: args.version + 1 },
          title: args.title,
          type: 'page',
          body: {
            storage: {
              value: args.content,
              representation: 'storage',
            },
          },
        };

        const response = await confluenceApi.put(
          `/content/${args.pageId}`,
          pageData
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'confluence_search': {
        const spaceKey = args.spaceKey || CONFLUENCE_SPACE_KEY;
        const cql = args.query.includes('space=')
          ? args.query
          : `space=${spaceKey} AND ${args.query}`;

        const response = await confluenceApi.get('/content/search', {
          params: {
            cql,
            limit: args.limit || 10,
            expand: 'body.storage,version',
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'confluence_list_pages': {
        const spaceKey = args.spaceKey || CONFLUENCE_SPACE_KEY;
        const response = await confluenceApi.get('/content', {
          params: {
            spaceKey,
            type: 'page',
            limit: args.limit || 25,
            expand: 'version',
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Confluence MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
