import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export const name = 'requirement-framing-dsh';
export const PACKAGE_NAME = 'requirement-framing-dsh';

/**
 * Resolve the packaged skills/ root from the DSH profile baseUrl.
 * Kept as a plain helper so the patch file and any host code share one rule:
 * the skill root is always derived from the installed package identity.
 */
export function resolveSkillRoot(profileBaseUrl) {
  if (!profileBaseUrl) {
    throw new Error('requirement-framing-dsh: missing DSH profile baseUrl for package resolution');
  }

  let manifestPath;
  try {
    manifestPath = createRequire(profileBaseUrl).resolve(`${PACKAGE_NAME}/package.json`);
  } catch (error) {
    throw new Error(
      `requirement-framing-dsh: cannot resolve ${PACKAGE_NAME}/package.json from the DSH profile`,
      { cause: error },
    );
  }

  return join(dirname(manifestPath), 'skills');
}
