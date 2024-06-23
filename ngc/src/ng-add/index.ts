import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {updatePlaywright} from "../util/update-playwright";


export function playwright(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return updatePlaywright(tree, _context, '1.40');
  };
}
