import { BusinessSetupRepository } from "./businessSetup.repository";

export class BusinessSetupService {

    private repository: BusinessSetupRepository;

    constructor() {
        this.repository = new BusinessSetupRepository();
    }

    private async getOrCreateSetupId(businessId: number): Promise<number> {

        const setup = await this.repository.getSetupByBusinessId(businessId);

        if (setup) return setup.id;

        return await this.repository.createSetup(businessId);

    }

    async createSetup(businessId: number) {

        return await this.getOrCreateSetupId(businessId);

    }

    async getSetup(businessId: number) {

        const setup = await this.repository.getSetupByBusinessId(businessId);

        if (!setup) return null;

        const setupId = setup.id;

        const [
            shopTypes,
            moduleItems,
            categoryGroups,
            categories,
            brands
        ] = await Promise.all([
            this.repository.getShopTypes(setupId),
            this.repository.getModuleItems(setupId),
            this.repository.getCategoryGroups(setupId),
            this.repository.getCategories(setupId),
            this.repository.getBrands(setupId)
        ]);

        return {
            ...setup,
            shopTypes,
            moduleItems,
            categoryGroups,
            categories,
            brands
        };

    }

    async deleteSetup(id: number, businessId: number) {

        return this.repository.deleteSetup(id, businessId);

    }

    async assignShopTypes(businessId: number, ids: number[]) {

        const setupId = await this.getOrCreateSetupId(businessId);

        return this.repository.assignShopTypes(setupId, businessId, ids);

    }

    async assignModuleItems(businessId: number, ids: number[]) {

        const setupId = await this.getOrCreateSetupId(businessId);

        return this.repository.assignModuleItems(setupId, businessId, ids);

    }

    async assignCategoryGroups(businessId: number, ids: number[]) {

        const setupId = await this.getOrCreateSetupId(businessId);

        return this.repository.assignCategoryGroups(setupId, businessId, ids);

    }

    async assignCategories(businessId: number, ids: number[]) {

        const setupId = await this.getOrCreateSetupId(businessId);

        return this.repository.assignCategories(setupId, businessId, ids);

    }

    async assignBrands(businessId: number, ids: number[]) {

        const setupId = await this.getOrCreateSetupId(businessId);

        return this.repository.assignBrands(setupId, businessId, ids);

    }

    async getAllShopTypes() {
        return await this.repository.getAllShopTypes();
    }

    async saveFullSetup(businessId: number, data: any) {

        const setupId = await this.getOrCreateSetupId(businessId);

        return this.repository.saveFullSetup(setupId, businessId, data);

    }

}