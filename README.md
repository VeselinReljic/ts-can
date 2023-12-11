# ts-can

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://badge.fury.io/veselinreljic/ts-can.svg)](https://badge.fury.io/veselinreljic/ts-can)

Small 0 dependencies TypeScript library for managing and checking user permissions

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [License](#license)

## Installation

```bash
npm install ts-can
```

## Usage
```ts
import { Permissions, TestRules, checkPermissions, canAllow } from 'permissions-library';

// Define user permissions
const userPermissions: Permissions = {
  'moduleA': {
    abilities: { read: true, write: false },
    checks: { isAdmin: (target) => target.isAdmin }
  },
  'moduleB': {
    abilities: { read: true, write: true },
    checks: { hasAccess: (target) => target.isValidUser }
  },
  // ... other modules
};

// Define test rules
const testRules: TestRules = {
  'moduleA': { abilities: ['read'] },
  'moduleB': { checks: ['hasAccess'], target: { isValidUser: true } },
  // ... other test rules
};

// Check if user has required permissions for all test rules
const result = canAllow(userPermissions, testRules);
console.log(result); // Output: true
```

## API Documentation

Please refer to the official [documentation](https://veselinreljic.github.io/ts-can/globals.html#canallow) for detailed information about the API and usage examples.
