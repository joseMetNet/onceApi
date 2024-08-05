import { IresponseRepositoryService, dataExample } from "../interface/example";

export const findExamples = async (): Promise<IresponseRepositoryService> => {
  try {
    // Buscar datos en la base de datos
    // Manejo de datos
    // Retornar respuesta formato json {code: 200, data: []...}
    return {
      code: 200,
      message: "example.succesfull",
      data: [{ _id: "example" }],
    };
  } catch (err: any) {
    console.log("Err repo findExample", err);
    return {
      code: 400,
      message: {translationKey: "example.errorInRepository", translationParams: {name: "findExample"}},
    };
  }
};

export const updateExample = async (data: dataExample): Promise<IresponseRepositoryService> => {
  try {
    const { _id } = data;
    // Actualizar example

    return {
      code: 200,
      message: {translationKey: "example.idComposed", translationParams: {_id}},
    };
  } catch (err: any) {
    console.log("Err updateExample", err);
    return {
      code: 400,
      message: {translationKey: "example.errorInRepository", translationParams: {name: "updateExample"}},
    };
  }
};

export const createExample = async (data: dataExample): Promise<IresponseRepositoryService> => {
  try {
    const { _id } = data;
    // crear example

    return {
      code: 200,
      message: {translationKey: "example.idComposed", translationParams: {_id}},
    };
  } catch (err: any) {
    console.log("Err createExample", err);
    return {
      code: 400,
      message: {translationKey: "example.errorInRepository", translationParams: {name: "createExample"}},
    };
  }
};

export const deleteExample = async (_id: string): Promise<IresponseRepositoryService> => {
  try {
    //   Eliminar Exaple por id

    return {
      code: 200,
      message: {translationKey: "example.idComposed", translationParams: {_id}},
    };
  } catch (err: any) {
    console.log("Err deleteExample", err);
    return {
      code: 400,
      message: {translationKey: "example.errorInRepository", translationParams: {name: "deleteExample"}},
    };
  }
};
