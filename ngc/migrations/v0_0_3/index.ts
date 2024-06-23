import {Rule} from "@angular-devkit/schematics";
import {updatePlaywright} from "../../src/util/update-playwright";

export function update_to_0_0_3(): Rule {
  return (tree, _context) => {
    updatePlaywright(tree, _context, '1.41');
  }
}
