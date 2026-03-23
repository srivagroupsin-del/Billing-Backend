import * as repo from "./business.repository";

export const getAllBusinesses = async () => {
  const data = await repo.getAllBusinesses();

  return {
    count: (data as any[]).length,
    data,
  };
};

export const getBusinessById = async (id: number) => {
  const business = await repo.getBusinessById(id);

  if (!business) {
    throw new Error("Business not found");
  }

  return business;
};

export const getBusinessByUserId = async (userId: number) => {
  const business = await repo.getBusinessesByUserId(userId);

  if (!business) {
    throw new Error("Business not found");
  }

  return business;
};

export const getAllOperationTypes = async () => {
  const data = await repo.getAllOperationTypes();
  return data;
};

export const enableStorageTypes = async (businessId: number, storageTypeIds: number[]) => {
  if (!Array.isArray(storageTypeIds)) {
    throw new Error("storage_type_ids must be an array");
  }

  await repo.enableStorageTypes(businessId, storageTypeIds);
};

export const getBusinessStorageTypes = async (businessId:number) => {

  return repo.getBusinessStorageTypes(businessId);

};