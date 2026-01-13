// Escalar JSON para objetos genéricos
import { registerEnumType, Scalar, CustomScalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";

@Scalar("JSONObject")
export class JSONObjectScalar implements CustomScalar<any, any> {
  description = "JSONObject custom scalar type";

  parseValue(value: any): any {
    return value; // value from the client
  }

  serialize(value: any): any {
    return value; // value sent to the client
  }

  parseLiteral(ast: ValueNode): ValueNode {
    if (ast.kind === Kind.OBJECT) {
      const value = Object.create(null);
      ast.fields.forEach((field) => {
        value[field.name.value] = this.parseLiteral(field.value);
      });
      return value;
    }
    return ast;
  }
}
