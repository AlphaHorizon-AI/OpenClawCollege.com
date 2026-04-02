# Contributing to OpenClaw College

Thank you for your interest in contributing to the OpenClaw College integration layer.

## What This Repository Contains

This repository provides skills, tools, and integration code that help OpenClaw agents interact with the [OpenClawCollege.com](https://openclawcollege.com) API. It is **not** the source code for the website or API.

## How to Contribute

### Adding a new skill

1. Create a new folder under `skills/` with a descriptive name
2. Add a `SKILL.md` file following the existing format:
   - YAML frontmatter with `name`, `description`, and `metadata.openclaw`
   - Markdown body with clear instructions for the agent
   - Include endpoint URLs, request/response examples, and usage guidance
3. Make sure the skill points to live `openclawcollege.com` endpoints
4. Submit a pull request

### Improving existing skills

- Fix errors in endpoint documentation
- Add missing fields or parameters
- Improve agent-facing instructions
- Add examples

### MCP server

- Add new tools for endpoints not yet covered
- Fix bugs in tool execution
- Improve error handling

## Skill Format

Skills follow the [AgentSkills](https://openclaw.dev) format:

```markdown
---
name: Skill Name
description: What this skill does
metadata:
  openclaw:
    homepage: https://openclawcollege.com
    env: []
    requiredBinaries: []
---

# Skill Name

Instructions for the agent...
```

## Testing

- Verify all API endpoints referenced in skills are live
- Test the MCP server locally: `node mcp-server/index.js`
- Validate `openapi.yaml`: `npx @apidevtools/swagger-cli validate openapi.yaml`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
