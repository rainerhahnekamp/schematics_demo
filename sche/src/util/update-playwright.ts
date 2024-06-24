import {Tree} from "@angular-devkit/schematics";
import {JsonValue} from "@angular-devkit/core";

type PackageJson = {
  devDependencies: Record<string, string>
}

function assertPackageJson(content: JsonValue): asserts content is PackageJson {
  if (!content) {
    throw new Error('does not work')
  }
}


export function updatePlaywright(tree: Tree, version: string) {
    const packageJson = tree.readJson('package.json');
    assertPackageJson(packageJson);

    if ('@playwright/test' in packageJson.devDependencies && packageJson.devDependencies["@playwright/test"] === version) {
      return tree;
    }

    packageJson.devDependencies['@playwright/test'] = version;
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    return tree;
}
