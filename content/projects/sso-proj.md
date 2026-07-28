---
title: "Enterprise SSO Identity Stack"
date: 2026-07-28
summary: "A complete identity and access management lab built with LDAP, Keycloak, Okta, and Grafana."
status: "completed"
# cover: "https://i.ibb.co/ynq1PYyT/sso.png"

tags:
  - "LDAP"
  - "Keycloak"
  - "Okta"
  - "OpenID Connect"
  - "SSO"

link: "https://github.com/sagarkpanda/sso-lab"
blogLink: "ldap-sso"
draft: false
---

## Project Overview

A production-style identity and access management lab demonstrating how modern applications authenticate users through OpenID Connect while centralizing identity and authorization.

The project builds a complete authentication stack from the ground up, beginning with an LDAP directory, federating identities into Keycloak, integrating a cloud Identity Provider with Okta, and securing Grafana using group-based authorization.

### What this project covers

- OpenLDAP directory service
- LDAP user and group management
- Keycloak as a self-hosted Identity Provider
- LDAP federation and synchronization
- OpenID Connect (OIDC)
- Grafana Single Sign-On
- Okta integration
- Group-based authorization using token claims
- Automatic HTTPS with Caddy
- Multi-server deployment on AWS EC2

### Technology Stack

- **OpenLDAP** – Directory service
- **phpLDAPadmin** – LDAP administration
- **Keycloak** – Self-hosted Identity Provider
- **PostgreSQL** – Keycloak database
- **Okta** – Cloud Identity Provider
- **Grafana** – OIDC-enabled application
- **Caddy** – Reverse proxy and automatic TLS
- **Docker & Docker Compose** – Application deployment
- **AWS EC2** – Infrastructure

📖 Read the complete implementation guide in the accompanying blog post.
