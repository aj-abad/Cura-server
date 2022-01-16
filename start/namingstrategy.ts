import { SnakeCaseNamingStrategy } from "@ioc:Adonis/Lucid/Orm";
import { BaseModel } from "@ioc:Adonis/Lucid/Orm";
import { string } from "@ioc:Adonis/Core/Helpers";
import Database from "@ioc:Adonis/Lucid/Database";

class PascalCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public tableName(model: typeof BaseModel) {
    return string.pluralize(string.pascalCase(model.name));
  }
  public columnName(_model: typeof BaseModel, propertyName: string) {
    return string.pascalCase(propertyName);
  }
  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName);
  }
  public relationLocalKey(
    relation: string,
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    if (relation === "belongsTo") {
      return relatedModel.primaryKey;
    }

    return model.primaryKey;
  }
  public relationForeignKey(
    relation: string,
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    if (relation === "belongsTo") {
      return string.pascalCase(
        `${relatedModel.name}_${relatedModel.primaryKey}`
      );
    }

    return string.pascalCase(`${model.name}_${model.primaryKey}`);
  }
  public relationPivotTable(
    _relation: "manyToMany",
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    return string.pascalCase([relatedModel.name, model.name].sort().join("_"));
  }
  public relationPivotForeignKey(
    _relation: "manyToMany",
    model: typeof BaseModel
  ) {
    return string.pascalCase(`${model.name}_${model.primaryKey}`);
  }
  public paginationMetaKeys() {
    return {
      total: "total",
      perPage: "per_page",
      currentPage: "current_page",
      lastPage: "last_page",
      firstPage: "first_page",
      firstPageUrl: "first_page_url",
      lastPageUrl: "last_page_url",
      nextPageUrl: "next_page_url",
      previousPageUrl: "previous_page_url",
    };
  }
}

Database.SimplePaginator.namingStrategy = new PascalCaseNamingStrategy();
BaseModel.namingStrategy = new PascalCaseNamingStrategy();
