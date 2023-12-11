/**
 * Represents a set of abilities, where each key is a string representing the ability name,
 * and the corresponding value is a boolean indicating whether the ability is granted or not.
 */
export type Abilities = {
  readonly [key: string]: boolean;
};
/**
 * Represents a set of checks, where each key is a string representing the check name,
 * and the corresponding value is a function that takes a target and returns a boolean.
 * The boolean indicates whether the check passes or not.
 *
 * @param {any} target - The target object to perform the check on.
 * @returns {boolean} - Returns true if the check passes, otherwise false.
 */
export type Checks = {
  readonly [key: string]: (target: any) => boolean;
};
/**
 * Represents a module of permissions with associated abilities and checks.
 *
 * @property {Abilities} abilities - The set of abilities associated with the module.
 * @property {Checks} checks - The set of checks associated with the module.
 */
export type PermissionModule = {
  readonly abilities: Abilities;
  readonly checks: Checks;
};
/**
 * Represents a collection of permissions, where each key is a string representing a module name,
 * and the corresponding value is a PermissionModule.
 */
export type Permissions = {
  readonly [key: string]: PermissionModule;
};
/**
 * Represents a set of rules defining permissions, typically used in the context of checking user permissions.
 *
 * @property {string} module - The optional module name to which the rules apply.
 * @property {readonly string[] | undefined} abilities - The optional list of abilities required by the rules.
 * @property {readonly string[] | undefined} checks - The optional list of checks required by the rules.
 * @property {unknown} target - The optional target object to perform checks against.
 */
export type Rules = {
  readonly module?: string;
  readonly abilities?: readonly string[] | undefined;
  readonly checks?: readonly string[] | undefined;
  readonly target?: unknown;
};
/**
 * Represents a collection of test rules, where each key is a string representing a rule name,
 * and the corresponding value is a Rules object.
 */
export type TestRules = {
  readonly [key: string]: Rules;
};

/**
 * Checks if a user has the required permissions based on specified rules.
 *
 * @param {Permissions} permissions - The object containing user permissions.
 * @param {Rules} rules - The rules specifying the required permissions and checks.
 * @returns {boolean} - Returns true if the user has the required permissions, otherwise false.
 * @example Basic usage
 * ```ts
 * const userPermissions = {
 *   'moduleA': {
 *     abilities: { read: true, write: false },
 *     checks: { isAdmin: (target) => target.isAdmin }
 *   },
 *   'moduleB': {
 *     abilities: { read: true, write: true },
 *     checks: { hasAccess: (target) => target.isValidUser }
 *   },
 *   // ... other modules
 * };
 *
 * const rules1 = { module: 'moduleA', abilities: ['read'] };
 * const result1 = checkPermissions(userPermissions, rules1);
 * console.log(result1); // Output: true
 * ```
 *
 * @example Checking with custom checks
 * ```ts
 * const rules2 = { module: 'moduleB', checks: ['hasAccess'], target: { isValidUser: true } };
 * const result2 = checkPermissions(userPermissions, rules2);
 * console.log(result2); // Output: true
 * ```
 *
 * @example No specified rules (always returns true)
 * ```ts
 * const rules3 = {};
 * const result3 = checkPermissions(userPermissions, rules3);
 * console.log(result3); // Output: true
 * ```
 */

export const checkPermissions = (
  permissions: Permissions,
  rules: Rules
): boolean => {
  if (rules.module === undefined || rules.module === 'undefined') {
    return true;
  }
  const permModule: PermissionModule = permissions[rules.module];
  if (!permModule) {
    return false;
  }
  if (rules.abilities) {
    if (
      rules.abilities.find((ability) => {
        return !permModule.abilities[ability];
      })
    ) {
      return false;
    }
  }
  if (rules.checks && rules.target) {
    if (
      rules.checks.find((check) => {
        return !permModule.checks[check](rules.target);
      })
    ) {
      return false;
    }
  }
  return true;
};
/**
 * Checks whether a set of permissions allows all specified test rules.
 *
 * @param {Permissions} permissions - The object containing user permissions.
 * @param {TestRules} test - The set of test rules to check against the user permissions.
 * @returns {boolean} - Returns true if the user has the required permissions for all test rules, otherwise false.
 *
 * @example
 * ```ts
 * const userPermissions = {
 *   'moduleA': {
 *     abilities: { read: true, write: false },
 *     checks: { isAdmin: (target) => target.isAdmin }
 *   },
 *   'moduleB': {
 *     abilities: { read: true, write: true },
 *     checks: { hasAccess: (target) => target.isValidUser }
 *   },
 *   // ... other modules
 * };
 *
 * const testRules = {
 *   'moduleA': { abilities: ['read'] },
 *   'moduleB': { checks: ['hasAccess'], target: { isValidUser: true } },
 *   // ... other test rules
 * };
 *
 * const result = canAllow(userPermissions, testRules);
 * console.log(result); // Output: true
 * ```
 */
export const canAllow = (
  permissions: Permissions,
  test: TestRules
): boolean => {
  /**
   * Iterates through each test rule and checks if the user permissions satisfy the rules.
   * Returns true if all test rules are satisfied, otherwise false.
   */
  return !Object.keys(test).find(
    (key) =>
      !checkPermissions(permissions, {
        ...test[key],
        module: key,
      })
  );
};
