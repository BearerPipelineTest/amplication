import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../../../types";
import { readFile } from "../../../../../util/module";
import {
  interpolate,
  NamedClassDeclaration,
  removeTSClassDeclares,
  getClassDeclarationById,
  deleteClassPropertyById,
} from "../../../../../util/ast";
import { isInputType } from "../../nestjs-graphql.util";

const DATA_ID = builders.identifier("data");
const templatePath = require.resolve("./create-args.template.ts");

export async function createCreateArgs(
  entity: Entity,
  createInput: NamedClassDeclaration
): Promise<NamedClassDeclaration> {
  const file = await readFile(templatePath);
  const id = createCreateArgsId(entity.name);

  interpolate(file, {
    ID: id,
    CREATE_INPUT: createInput.id,
  });

  const classDeclaration = getClassDeclarationById(file, id);

  if (!isInputType(createInput)) {
    deleteClassPropertyById(classDeclaration, DATA_ID);
  }

  removeTSClassDeclares(file);

  return classDeclaration as NamedClassDeclaration;
}

export function createCreateArgsId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`Create${entityType}Args`);
}
