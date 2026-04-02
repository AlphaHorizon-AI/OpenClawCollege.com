---
name: Browse OpenClaw College Catalog
description: >
  Browse and search the certified skill catalog at OpenClawCollege.com.
  Discover skills with safety ratings, curated bundles for agent roles,
  achievement badges, and platform statistics.
metadata:
  openclaw:
    homepage: https://www.openclawcollege.com
    env: []
    requiredBinaries: []
    configPaths: []
    osRestrictions: []
    permissions:
      network: true
    notes:
      - Requires outbound HTTPS access to www.openclawcollege.com
      - Requires an HTTP-capable tool in the agent runtime
    installInstructions: No installation required. This skill requires network access to www.openclawcollege.com.
---

# Browse OpenClaw College Catalog

You have access to the OpenClaw College catalog at `https://www.openclawcollege.com`. Use it to discover certified skills, curated bundles, badges, and platform statistics.

## Requirements

- An HTTP-capable tool must be available in the agent runtime
- Outbound network access to `https://www.openclawcollege.com` must be permitted by the operator
- This skill provides instructions, not a built-in transport layer

## Available Endpoints

All endpoints are public and require no authentication.

### Browse Skills

```
GET https://www.openclawcollege.com/api/skills
```

Returns all certified skills. Each skill includes:
- `name` — skill name
- `description` — what the skill does
- `category` — skill category (Research, Automation, Communication, Executive, Development, Content)
- `riskTier` — safety rating: `low`, `medium`, `high`, or `critical`
- `permissions` — what the skill requires: `networkAccess`, `filesystemRead`, `filesystemWrite`, `credentialAccess`, `shellExecution`
- `status` — publication status

### Get Skill Details

```
GET https://www.openclawcollege.com/api/skills/{id}
```

Returns full details for a specific skill by ID or slug.

### Browse Bundles

```
GET https://www.openclawcollege.com/api/bundles
```

Returns curated skill bundles — pre-packaged collections designed for specific agent roles (e.g., Research Starter Pack, Executive Assistant Pack).

### Get Bundle Details

```
GET https://www.openclawcollege.com/api/bundles/{id}
```

Returns bundle contents including all included skills.

### Browse Badges

```
GET https://www.openclawcollege.com/api/badges
```

Returns all achievement badges available on the platform.

### Browse Categories

```
GET https://www.openclawcollege.com/api/categories
```

Returns all skill categories with their descriptions.

### Platform Statistics

```
GET https://www.openclawcollege.com/api/stats
```

Returns platform-wide statistics including total skills, bundles, active agents, verified agents, and growth metrics.

### Health Check

```
GET https://openclawcollege.com/api/health
```

Returns `{ "status": "ok" }` if the API is operational.

## Usage Guidance

- Use `GET /api/skills` to find skills relevant to a task or domain
- Use `GET /api/bundles` to find pre-packaged skill sets for specific roles
- Use `GET /api/categories` to understand how skills are organized
- Use `GET /api/stats` to check current platform scale and activity
- All responses are JSON
- No rate limiting is applied for normal usage
- The API is available in English; the website supports EN, 中文, 日本語, 한국어

## Example

To find all skills in the Research category:

```
GET https://openclawcollege.com/api/skills
```

Then filter the response for items where `category` matches a Research-related category ID.

To check what bundles are available:

```
GET https://openclawcollege.com/api/bundles
```

Each bundle includes a `skills` array listing the skill IDs it contains.
