[FAIL] https://raw.githubusercontent.com/svtgrig-truest/Leasehold-buddy/main/README.md - The remote server returned an error: (404) Not Found.

[FAIL] https://raw.githubusercontent.com/svtgrig-truest/Leasehold-buddy/master/README.md - The remote server returned an error: (404) Not Found.

[OK] https://raw.githubusercontent.com/brightdata/real-estate-ai-agent/main/README.md (200, 4310 bytes)
<p align="center">
  <a href="https://brightdata.com/">
    <img src="https://mintlify.s3.us-west-1.amazonaws.com/brightdata/logo/light.svg" width="300" alt="Bright Data Logo">
  </a>
</p>

# Real Estate AI Agent System

**AI-Powered Solution for Real Estate Public Data Extraction**

<div align="center">
  <img src="https://img.shields.io/badge/python-3.9+-blue"/>
  <img src="https://img.shields.io/badge/License-MIT-blue"/>
</div>

---

## 🌟 Overview

Real Estate AI Agent System is a Python-based solution that leverages AI agents and Bright Data's Model Context Protocol (MCP) server to extract, process, and deliver structured real estate property data from multiple sources.

- Automates public property data extraction from real estate websites like [Zillow](https://brightdata.com/products/web-scraper/zillow), [Realtor.com](https://brightdata.com/products/web-scraper/realtor), Redfin, and more  
- Integrates with Bright Data proxies for robust anti-bot and geo-unblocking  
- Uses Nebius Qwen LLM for adaptive, schema-validated property data extraction  
- Outputs results as structured JSON for analytics or downstream applications

---

## Table of Contents

- ✨ Features
- 🚀 Quickstart
- 🔧 Environment Setup
- 💡 Usage Example
- 📈 Key Capabilities
- 🔒 Security Best Practices

---

## ✨ Features

- **Intelligent AI Agents:** Uses CrewAI and LLM for adaptive data extraction and property detail parsing.
- **Bright Data Integration:** Seamless support for proxy rotation, CAPTCHA solving via MCP server.
- **Strict JSON Schema:** Always returns result in snake_case, schema-validated JSON.
- **Plug-and-Play:** Spin up an advanced real estate data pipeline in minutes.
- **Cross-Platform:** Python 3.9; requires Node.js for Bright Data MCP server.

---

## 🚀 Quickstart

1. Clone this repository

   ~~~sh
   git clone https://github.com/brightdata-com/real-estate-ai-agents.git
   cd real-estate-ai-agents
   ~~~

---

## 🔧 Environment Setup

### Prerequisites

- Python 3.9+
- Node.js + npm (for Bright Data MCP server)
- Bright Data account with API token
- Nebius AI API key

### Virtual Environment

macOS/Linux
~~~sh
python3.9 -m venv venv
source venv/bin/activate
~~~

Windows
~~~sh
python3.9 -m venv venv
.\venv\Scripts\activate
~~~

### Install Dependencies

~~~sh
pip install "crewai-tools[mcp]" crewai mcp python-dotenv pandas
~~~

### Add Environment Variables

Create a `.env` file in your project directory with the following:

~~~env
BRIGHT_DATA_API_TOKEN="your_...

[OK] https://raw.githubusercontent.com/drivendataorg/open-ai-caribbean/main/README.md (200, 6084 bytes)
[<img src='https://s3.amazonaws.com/drivendata-public-assets/logo-white-blue.png' width='600'>](https://www.drivendata.org/)
<br><br>

<div align="center">
<img src='https://s3.amazonaws.com/drivendata-public-assets/castries_ortho-cog-thumbnail.png' alt='Banner Image' width='500'>
</div>

# Open AI Caribbean Challenge: Mapping Disaster Risk from Aerial Imagery

## Goal of the Competition

Natural hazards like earthquakes, hurricanes, and floods can have a devastating impact on the people and communities they affect. This is especially true where houses and buildings are not up to modern construction standards, often in poor and informal settlements. While buildings can be retrofit to better prepare them for disaster, the traditional method for identifying high-risk buildings involves going door to door by foot, taking weeks if not months and costing millions of dollars.

The World Bank Global Program for Resilient Housing and WeRobotics teamed up to prepare aerial drone imagery of buildings across the Caribbean annotated with characteristics that matter to building inspectors.

In this challenge, the goal was to use aerial imagery to classify the roof material of identified buildings in St. Lucia, Guatemala, and Colombia. Roof material is one of the main risk factors for earthquakes and hurricanes and a predictor of other risk factors, like building material, that are as not readily seen from the air. Machine learning models that are able to most accurately map disaster risk from drone imagery will help drive faster, cheaper prioritization of building inspections and target resources for disaster preparation where they will have the most impact.

## What's in this Repository
This repository contains code provided by leading competitors in the [Open AI Caribbean Challenge: Mapping Disaster Risk from Aerial Imagery](https://www.drivendata.org/competitions/58/disaster-response-roof-type/) DrivenData challenge. Code for all winning solutions are open source under the MIT License.

**Winning code for other DrivenData competitions is available in the [competition-winners repository](https://github.com/drivendataorg/competition-winners).**

## Winning Submissions

Place |Team or User | Public Score | Private Score | Summary of Model
--- | --- | --- | --- | ---
1 | The team | 0.332897 | 0.354327 |Our approach is based on a two-layer pipeline, where the first layer is a CNN image classifier and the second one a GBM model adding extra features to the first layer pre...

[OK] https://raw.githubusercontent.com/hummingbot/condor/main/README.md (200, 19631 bytes)
# Condor

A Telegram bot for monitoring and trading with Hummingbot via the **Hummingbot API**.

> **Why we recommend Tailscale for production**
>
> Condor controls real trading through Hummingbot API: orders, balances, bots, and stored exchange keys. That has always required strong passwords and careful configuration—but **the risk surface has grown**. Trading agents, MCP tools, and other AI assistants make powerful API actions easier to trigger, while cloud VPSes are constantly scanned for open ports like **8000**.
>
> **Tailscale is one safeguard you can add**: it puts the API on a private encrypted network so only your devices can reach it, without publishing port 8000 to the internet. It does **not** replace proper security—use strong API and config passwords, and avoid exposing sensitive services publicly. Tailscale also works when Condor and the API run on the **same machine**.
>
> Full walkthrough: [Securing Condor and Hummingbot API with Tailscale](https://hummingbot.org/blog/posts/securing-condor-and-hummingbot-api-with-tailscale/) · [Hummingbot API Tailscale guide](https://hummingbot.org/hummingbot-api/tailscale/)

## Features

- **Portfolio Dashboard** - Comprehensive portfolio view with PNL tracking, 24h changes, and graphical analysis
- **Bot Monitoring** - Track active Hummingbot trading bots with real-time status and metrics
- **CLOB Trading** - Place orders on centralized exchanges (Binance, Bybit, etc.) with interactive menus
- **DEX Trading** - Swap tokens and manage CLMM liquidity positions via Gateway
- **Configuration** - Manage API servers, exchange credentials, and Gateway through Telegram (`/servers`, `/keys`, `/gateway`)
- **AI Assistant** - Natural language trading help via **`/agent`** (optional OpenAI or OpenRouter keys, or any custom OpenAI-compatible endpoint like Venice AI; MCP tools when configured)

## What you need

- A **Mac** or **Linux** computer (Windows users: install **WSL2** with Ubuntu, then use Terminal inside Ubuntu).
- The **Terminal** app open.
- A **stable internet** connection.
- For **Hummingbot API** (the API-only install below, or if you choose to add the API during Condor setup): **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Mac/Windows) or Docker on Linux, **installed and running** on that machine before you run the command.
- **[Tailscale](https://tailscale.com) account** (free tier is enough) — **recommended for production**, especially when Condor and the API run on different...

[FAIL] https://raw.githubusercontent.com/jechaviz/future_caribbean_ai_buildathon/main/cmd/fcbuild.v - The remote server returned an error: (404) Not Found.

[OK] https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/contents/cmd (200, 802 bytes)
[{"name":"fcbuild","path":"cmd/fcbuild","sha":"78c84bcd1ca338b3a192a28d2fb67429cc0e8246","size":0,"url":"https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/contents/cmd/fcbuild?ref=main","html_url":"https://github.com/jechaviz/future_caribbean_ai_buildathon/tree/main/cmd/fcbuild","git_url":"https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/git/trees/78c84bcd1ca338b3a192a28d2fb67429cc0e8246","download_url":null,"type":"dir","_links":{"self":"https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/contents/cmd/fcbuild?ref=main","git":"https://api.github.com/repos/jechaviz/future_caribbean_ai_buildathon/git/trees/78c84bcd1ca338b3a192a28d2fb67429cc0e8246","html":"https://github.com/jechaviz/future_caribbean_ai_buildathon/tree/main/cmd/fcbuild"}}]

[OK] https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents (200, 5771 bytes)
[{"name":".gitignore","path":".gitignore","sha":"776e8b163c862fe192463ad2afa1e19cfa81dce0","size":303,"url":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents/.gitignore?ref=main","html_url":"https://github.com/svtgrig-truest/Leasehold-buddy/blob/main/.gitignore","git_url":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/git/blobs/776e8b163c862fe192463ad2afa1e19cfa81dce0","download_url":"https://raw.githubusercontent.com/svtgrig-truest/Leasehold-buddy/main/.gitignore","type":"file","_links":{"self":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents/.gitignore?ref=main","git":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/git/blobs/776e8b163c862fe192463ad2afa1e19cfa81dce0","html":"https://github.com/svtgrig-truest/Leasehold-buddy/blob/main/.gitignore"}},{"name":"IMPLEMENTATION_PLAN.md","path":"IMPLEMENTATION_PLAN.md","sha":"c1b18d62f0fc0adb1f8c569b35ef589d27bfe33c","size":33273,"url":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents/IMPLEMENTATION_PLAN.md?ref=main","html_url":"https://github.com/svtgrig-truest/Leasehold-buddy/blob/main/IMPLEMENTATION_PLAN.md","git_url":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/git/blobs/c1b18d62f0fc0adb1f8c569b35ef589d27bfe33c","download_url":"https://raw.githubusercontent.com/svtgrig-truest/Leasehold-buddy/main/IMPLEMENTATION_PLAN.md","type":"file","_links":{"self":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents/IMPLEMENTATION_PLAN.md?ref=main","git":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/git/blobs/c1b18d62f0fc0adb1f8c569b35ef589d27bfe33c","html":"https://github.com/svtgrig-truest/Leasehold-buddy/blob/main/IMPLEMENTATION_PLAN.md"}},{"name":"MARKETING_PLAN.md","path":"MARKETING_PLAN.md","sha":"3d94e2093e650431add5535c05db2622a4debcbd","size":8751,"url":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents/MARKETING_PLAN.md?ref=main","html_url":"https://github.com/svtgrig-truest/Leasehold-buddy/blob/main/MARKETING_PLAN.md","git_url":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/git/blobs/3d94e2093e650431add5535c05db2622a4debcbd","download_url":"https://raw.githubusercontent.com/svtgrig-truest/Leasehold-buddy/main/MARKETING_PLAN.md","type":"file","_links":{"self":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/contents/MARKETING_PLAN.md?ref=main","git":"https://api.github.com/repos/svtgrig-truest/Leasehold-buddy/git/blobs/3d94e2093e650431...

[OK] https://api.github.com/repos/brightdata/real-estate-ai-agent/contents (200, 2600 bytes)
[{"name":"README.md","path":"README.md","sha":"44ac74306e7010a5a601ae89b9f3966012af7c9a","size":4338,"url":"https://api.github.com/repos/brightdata/real-estate-ai-agent/contents/README.md?ref=main","html_url":"https://github.com/brightdata/real-estate-ai-agent/blob/main/README.md","git_url":"https://api.github.com/repos/brightdata/real-estate-ai-agent/git/blobs/44ac74306e7010a5a601ae89b9f3966012af7c9a","download_url":"https://raw.githubusercontent.com/brightdata/real-estate-ai-agent/main/README.md","type":"file","_links":{"self":"https://api.github.com/repos/brightdata/real-estate-ai-agent/contents/README.md?ref=main","git":"https://api.github.com/repos/brightdata/real-estate-ai-agent/git/blobs/44ac74306e7010a5a601ae89b9f3966012af7c9a","html":"https://github.com/brightdata/real-estate-ai-agent/blob/main/README.md"}},{"name":"pyproject.toml","path":"pyproject.toml","sha":"8341a8b5627fc78b90e280602efdbe486fb18713","size":366,"url":"https://api.github.com/repos/brightdata/real-estate-ai-agent/contents/pyproject.toml?ref=main","html_url":"https://github.com/brightdata/real-estate-ai-agent/blob/main/pyproject.toml","git_url":"https://api.github.com/repos/brightdata/real-estate-ai-agent/git/blobs/8341a8b5627fc78b90e280602efdbe486fb18713","download_url":"https://raw.githubusercontent.com/brightdata/real-estate-ai-agent/main/pyproject.toml","type":"file","_links":{"self":"https://api.github.com/repos/brightdata/real-estate-ai-agent/contents/pyproject.toml?ref=main","git":"https://api.github.com/repos/brightdata/real-estate-ai-agent/git/blobs/8341a8b5627fc78b90e280602efdbe486fb18713","html":"https://github.com/brightdata/real-estate-ai-agent/blob/main/pyproject.toml"}},{"name":"real_estate_agents.py","path":"real_estate_agents.py","sha":"3644d35f774bc59e08a03d0b6cbfb2dd13fc9610","size":3359,"url":"https://api.github.com/repos/brightdata/real-estate-ai-agent/contents/real_estate_agents.py?ref=main","html_url":"https://github.com/brightdata/real-estate-ai-agent/blob/main/real_estate_agents.py","git_url":"https://api.github.com/repos/brightdata/real-estate-ai-agent/git/blobs/3644d35f774bc59e08a03d0b6cbfb2dd13fc9610","download_url":"https://raw.githubusercontent.com/brightdata/real-estate-ai-agent/main/real_estate_agents.py","type":"file","_links":{"self":"https://api.github.com/repos/brightdata/real-estate-ai-agent/contents/real_estate_agents.py?ref=main","git":"https://api.github.com/repos/brightdata/real-estate-ai-agent/git/blobs/3644d35f774bc59e08a03d0b6cbfb2dd13fc...


