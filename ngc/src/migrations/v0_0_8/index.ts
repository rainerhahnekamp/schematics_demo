import {Rule} from "@angular-devkit/schematics";
import {updatePlaywright} from "../../util/update-playwright";

export default function update_to_0_0_8(): Rule {
  return (tree, _context) => {
    updatePlaywright(tree, _context, '1.41');
  }
}
