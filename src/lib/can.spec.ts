import test from 'ava';

import { canAllow, checkPermissions, Permissions, TestRules } from './can';

const userPermissions: Permissions = {
  moduleA: {
    abilities: { read: true, write: false },
    checks: { isAdmin: (target) => target.isAdmin },
  },
  moduleB: {
    abilities: { read: true, write: true },
    checks: { hasAccess: (target) => target.isValidUser },
  },
};

test('checkPermissions returns true when user has required permissions', (t) => {
  const rules = { module: 'moduleA', abilities: ['read'] };
  const result = checkPermissions(userPermissions, rules);

  t.true(result);
});

test('checkPermissions returns false when user lacks required abilities', (t) => {
  const rules = { module: 'moduleA', abilities: ['write'] };
  const result = checkPermissions(userPermissions, rules);

  t.false(result);
});

test('checkPermissions returns false when user lacks required checks', (t) => {
  const rules = {
    module: 'moduleB',
    checks: ['hasAccess'],
    target: { isValidUser: false },
  };
  const result = checkPermissions(userPermissions, rules);

  t.false(result);
});
test('checkPermissions returns true when no specific rules are provided', (t) => {
  const rules = {};
  const result = checkPermissions(userPermissions, rules);

  t.true(result);
});

test('checkPermissions returns true for undefined module in rules', (t) => {
  const rules = { module: undefined, abilities: ['read'] };
  const result = checkPermissions(userPermissions, rules);

  t.true(result);
});

test('checkPermissions returns true for module with undefined abilities in rules', (t) => {
  const rules = { module: 'moduleA', abilities: undefined };
  const result = checkPermissions(userPermissions, rules);

  t.true(result);
});

test('checkPermissions returns false for non-existent module in user permissions', (t) => {
  const rules = { module: 'nonExistentModule', abilities: ['read'] };
  const result = checkPermissions(userPermissions, rules);

  t.false(result);
});

test('canAllow returns true when user has required permissions for all test rules', (t) => {
  const testRules: TestRules = {
    moduleA: { abilities: ['read'] },
    moduleB: { checks: ['hasAccess'], target: { isValidUser: true } },
  };
  const result = canAllow(userPermissions, testRules);

  t.true(result);
});

test('canAllow returns false when user lacks required permissions for at least one test rule', (t) => {
  const testRules: TestRules = {
    moduleA: { abilities: ['write'] }, // User lacks 'write' ability in moduleA
    moduleB: { checks: ['hasAccess'], target: { isValidUser: false } },
  };
  const result = canAllow(userPermissions, testRules);

  t.false(result);
});
