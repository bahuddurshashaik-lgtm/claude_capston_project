# Confluence MCP Server

A Model Context Protocol (MCP) server for integrating with Atlassian Confluence. This server enables Claude Code to interact with Confluence pages directly.

## Features

- **Create Pages**: Create new Confluence pages with content
- **Get Pages**: Retrieve page content by ID or title
- **Update Pages**: Update existing pages
- **Search**: Search for pages using CQL (Confluence Query Language)
- **List Pages**: List all pages in a space

## Setup

### 1. Install Dependencies

```bash
cd src/mcp-servers/confluence
npm install
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your credentials:
   - `CONFLUENCE_EMAIL`: Your Atlassian account email
   - `CONFLUENCE_API_TOKEN`: Generate at https://id.atlassian.com/manage-profile/security/api-tokens
   - `CONFLUENCE_SPACE_KEY`: Your Confluence space key (default: ClaudeCpas)

### 3. Configure Claude Code

Add the MCP server to your Claude Code settings:

**Windows**: `%USERPROFILE%\.claude\settings.json`
**Mac/Linux**: `~/.claude/settings.json`

```json
{
  "mcpServers": {
    "confluence": {
      "command": "node",
      "args": ["C:/Users/shaiksai_bahuddursha/Documents/GitHub_Copilot_Capstone_Project/claude_capston_project/src/mcp-servers/confluence/index.js"],
      "env": {
        "CONFLUENCE_BASE_URL": "https://bahuddurshashaik.atlassian.net/wiki",
        "CONFLUENCE_EMAIL": "your-email@example.com",
        "CONFLUENCE_API_TOKEN": "your-api-token",
        "CONFLUENCE_SPACE_KEY": "ClaudeCpas"
      }
    }
  }
}
```

### 4. Test the Server

```bash
npm start
```

## Available Tools

### confluence_create_page
Create a new page in Confluence.

**Parameters:**
- `title` (required): Page title
- `content` (required): Page content in Confluence storage format (HTML-like)
- `spaceKey` (optional): Confluence space key
- `parentId` (optional): Parent page ID

### confluence_get_page
Retrieve a page by ID or title.

**Parameters:**
- `pageId`: Page ID
- `title`: Page title
- `spaceKey` (optional): Confluence space key

### confluence_update_page
Update an existing page.

**Parameters:**
- `pageId` (required): Page ID
- `title` (required): New page title
- `content` (required): New page content
- `version` (required): Current page version number

### confluence_search
Search for pages using CQL.

**Parameters:**
- `query` (required): Search query (CQL)
- `spaceKey` (optional): Confluence space key
- `limit` (optional): Maximum results (default: 10)

### confluence_list_pages
List all pages in a space.

**Parameters:**
- `spaceKey` (optional): Confluence space key
- `limit` (optional): Maximum results (default: 25)

## Example Usage

Once configured in Claude Code, you can use natural language commands:

- "Create a user story in Confluence titled 'User Authentication Feature'"
- "Get the page titled 'Architecture Design' from Confluence"
- "Search Confluence for pages about API documentation"
- "List all pages in the ClaudeCpas space"

## Confluence Storage Format

Confluence uses a special HTML-like format called "storage format". Example:

```html
<h1>Heading 1</h1>
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>
<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p>This is an info panel</p>
  </ac:rich-text-body>
</ac:structured-macro>
```

## Troubleshooting

### Authentication Issues
- Verify your API token is valid and hasn't expired
- Ensure your email address is correct
- Check that you have proper permissions in the Confluence space

### Connection Issues
- Verify the `CONFLUENCE_BASE_URL` is correct
- Check your internet connection
- Ensure the Confluence instance is accessible

## Security Notes

- **Never commit your `.env` file** - it contains sensitive credentials
- Store API tokens securely
- Use environment variables for production deployments
- Regularly rotate API tokens

## License

MIT
