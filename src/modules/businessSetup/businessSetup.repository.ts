import pool from "../../config/db";

export class BusinessSetupRepository {

    async getSetupByBusinessId(businessId: number) {

        const [rows]: any = await pool.execute(
            `SELECT * FROM business_setup WHERE business_id = ?`,
            [businessId]
        );

        return rows[0];

    }

    async createSetup(businessId: number) {

        const [result]: any = await pool.execute(
            `INSERT INTO business_setup (business_id) VALUES (?)`,
            [businessId]
        );

        return result.insertId;

    }

    async deleteSetup(id: number, businessId: number) {

        const [result]: any = await pool.execute(
            `DELETE FROM business_setup WHERE id = ? AND business_id = ?`,
            [id, businessId]
        );

        return result.affectedRows;

    }

    private async assignGeneric(
        table: string,
        setupId: number,
        businessId: number,
        column: string,
        ids: number[]
    ) {

        const connection = await pool.getConnection();

        try {

            await connection.beginTransaction();

            await connection.query(
                `DELETE FROM ${table} WHERE setup_id = ? AND business_id = ?`,
                [setupId, businessId]
            );

            if (ids?.length) {

                const values = ids.map(id => [businessId, setupId, id]);

                await connection.query(
                    `INSERT INTO ${table} (business_id, setup_id, ${column}) VALUES ?`,
                    [values]
                );

            }

            await connection.commit();

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();

        }

    }

    async assignShopTypes(setupId: number, businessId: number, ids: number[]) {

        await this.assignGeneric(
            "business_setup_shop_types",
            setupId,
            businessId,
            "shop_type_id",
            ids
        );

    }

    async assignModuleItems(setupId: number, businessId: number, ids: number[]) {

        await this.assignGeneric(
            "business_setup_module_items",
            setupId,
            businessId,
            "module_item_id",
            ids
        );

    }

    async assignCategoryGroups(setupId: number, businessId: number, ids: number[]) {

        await this.assignGeneric(
            "business_setup_category_groups",
            setupId,
            businessId,
            "category_group_id",
            ids
        );

    }

    async assignCategories(setupId: number, businessId: number, ids: number[]) {

        await this.assignGeneric(
            "business_setup_categories",
            setupId,
            businessId,
            "category_id",
            ids
        );

    }

    async assignBrands(setupId: number, businessId: number, ids: number[]) {

        await this.assignGeneric(
            "business_setup_brands",
            setupId,
            businessId,
            "brand_id",
            ids
        );

    }

    /* =========================
   GET ASSIGNMENTS
    ========================= */

    async getShopTypes(setupId: number) {

    const [rows]: any = await pool.execute(
        `SELECT stm.*
        FROM shop_type_master stm
        JOIN business_setup_shop_types bsst
        ON stm.id = bsst.shop_type_id
        WHERE bsst.setup_id = ?`,
        [setupId]
    );

    return rows;

    }

    async getAllShopTypes() {

        const [rows]: any = await pool.execute(
        `SELECT id, name
        FROM shop_type_master
        ORDER BY name`
        );

    return rows;

  }

    async getModuleItems(setupId: number) {

    const [rows]: any = await pool.execute(
        `SELECT bmi.*
        FROM business_module_items bmi
        JOIN business_setup_module_items bsmi
        ON bmi.id = bsmi.module_item_id
        WHERE bsmi.setup_id = ?`,
        [setupId]
    );

    return rows;

    }

    async getCategoryGroups(setupId: number) {

    const [rows]: any = await pool.execute(
        `SELECT *
        FROM business_setup_category_groups
        WHERE setup_id = ?`,
        [setupId]
    );

    return rows;

    }

    async getCategories(setupId: number) {

    const [rows]: any = await pool.execute(
        `SELECT *
        FROM business_setup_categories
        WHERE setup_id = ?`,
        [setupId]
    );

    return rows;

    }

    async getBrands(setupId: number) {

    const [rows]: any = await pool.execute(
        `SELECT *
        FROM business_setup_brands
        WHERE setup_id = ?`,
        [setupId]
    );

    return rows;

    }

    async saveFullSetup(setupId: number, businessId: number, data: any) {

        const connection = await pool.getConnection();

        try {

            await connection.beginTransaction();

            const assignments = [
                { table: "business_setup_shop_types", col: "shop_type_id", ids: data.shopTypeIds },
                { table: "business_setup_module_items", col: "module_item_id", ids: data.moduleItemIds },
                { table: "business_setup_category_groups", col: "category_group_id", ids: data.categoryGroupIds },
                { table: "business_setup_categories", col: "category_id", ids: data.categoryIds },
                { table: "business_setup_brands", col: "brand_id", ids: data.brandIds }
            ];

            for (const item of assignments) {

                await connection.query(
                    `DELETE FROM ${item.table} WHERE setup_id = ? AND business_id = ?`,
                    [setupId, businessId]
                );

                if (item.ids?.length) {

                    const values = item.ids.map((id: number) => [businessId, setupId, id]);

                    await connection.query(
                        `INSERT INTO ${item.table} (business_id, setup_id, ${item.col}) VALUES ?`,
                        [values]
                    );

                }

            }

            await connection.commit();

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();

        }

    }

}