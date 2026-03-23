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

            res.status(201).json({
                success: true,
                message: "Business setup initialized",
                data: { id }
            });

        } catch (error: any) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

    getSetup = async (req: AuthRequest, res: Response) => {

        try {

            const businessId = req.user?.business_id;

            const setup = await this.service.getSetup(businessId!);

            res.status(200).json({
                success: true,
                message: "Business setup fetched",
                data: setup || {}
            });

        } catch (error: any) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

    deleteSetup = async (req: AuthRequest, res: Response) => {

        try {

            const businessId = req.user?.business_id;
            const { id } = req.params;

            await this.service.deleteSetup(Number(id), businessId!);

            res.status(200).json({
                success: true,
                message: "Setup deleted"
            });

        } catch (error: any) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

    assignShopTypes = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignShopTypes(businessId!, req.body.shopTypeIds);

        res.json({ success: true });

    };

    assignModuleItems = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignModuleItems(businessId!, req.body.moduleItemIds);

        res.json({ success: true });

    };

    assignCategoryGroups = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignCategoryGroups(businessId!, req.body.categoryGroupIds);

        res.json({ success: true });

    };

    assignCategories = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignCategories(businessId!, req.body.categoryIds);

        res.json({ success: true });

    };

    assignBrands = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.assignBrands(businessId!, req.body.brandIds);

        res.json({ success: true });

    };

    getAllShopTypes = async (req: Request, res: Response) => {

        try {

        const data = await this.service.getAllShopTypes();

        res.status(200).json({
            success: true,
            message: "Shop types fetched",
            data
        });

        } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message
        });

        }

    };

    saveFullSetup = async (req: AuthRequest, res: Response) => {

        const businessId = req.user?.business_id;

        await this.service.saveFullSetup(businessId!, req.body);

        res.json({
            success: true,
            message: "Full setup saved"
        });

    };

}