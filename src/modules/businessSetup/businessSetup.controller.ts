import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response, Request } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { BusinessSetupService } from "./businessSetup.service";

export class BusinessSetupController {

    private service: BusinessSetupService;

    constructor() {
        this.service = new BusinessSetupService();
    }

    createSetup = async (req: AuthRequest, res: Response) => {

        try {

            const businessId = req.user?.business_id;

            const id = await this.service.createSetup(businessId!);

            successResponse({ res, data: { id }, message: "Business setup initialized", statusCode: 201 });

        } catch (error: any) {

            throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);

        }

    };

    getSetup = async (req: AuthRequest, res: Response) => {

        try {

            const businessId = req.user?.business_id;

            const setup = await this.service.getSetup(businessId!);

            successResponse({ res, data: setup || {}, message: "Business setup fetched", statusCode: 200 });

        } catch (error: any) {

            throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);

        }

    };

    deleteSetup = async (req: AuthRequest, res: Response) => {

        try {

            const businessId = req.user?.business_id;
            const { id } = req.params;

            await this.service.deleteSetup(Number(id), businessId!);

            successResponse({ res, message: "Setup deleted", statusCode: 200 });

        } catch (error: any) {

            throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);

        }

    };

    assignShopTypes = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignShopTypes(businessId!, req.body.shopTypeIds);

        successResponse({ res });

    };

    assignModuleItems = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignModuleItems(businessId!, req.body.moduleItemIds);

        successResponse({ res });

    };

    assignCategoryGroups = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignCategoryGroups(businessId!, req.body.categoryGroupIds);

        successResponse({ res });

    };

    assignCategories = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignCategories(businessId!, req.body.categoryIds);

        successResponse({ res });

    };

    assignBrands = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignBrands(businessId!, req.body.brandIds);

        successResponse({ res });

    };

    getAllShopTypes = async (req: Request, res: Response) => {

        try {

        const data = await this.service.getAllShopTypes();

        successResponse({ res, data: data, message: "Shop types fetched", statusCode: 200 });

        } catch (error: any) {

        throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);

        }

    };

    saveFullSetup = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.saveFullSetup(businessId!, req.body);

        successResponse({ res, message: "Full setup saved" });

    };

}