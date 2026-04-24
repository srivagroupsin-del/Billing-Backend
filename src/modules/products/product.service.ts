import * as repo from "./product.repository";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { logAudit } from "../audit/audit.service";
import pool from "../../config/db";
import { ensureUniqueActive } from "../../utils/uniqueCheck";

/* =========================================
   FETCH ALL PRODUCTS
========================================= */
export const fetchProducts = async (search: string = "") => {
  return repo.getProducts(search);
};

/* =========================================
   FETCH SINGLE PRODUCT
========================================= */
export const fetchProductById = async (id: number) => {
  const rows = await repo.getProductById(id);

  if (!rows || rows.length === 0) {
    throw new Error("Product not found");
  }

  const first = rows[0];

  const product = {
    id: first.id,
    product_name: first.product_name,
    model: first.model,
    series: first.series,
    mrp: first.mrp,
    description: first.description,
    info: first.info,
    note: first.note,
    system_note: first.system_note,
    base_image: first.base_image,
    status: first.status,
    alternative_names: [] as string[],
    mappings: [] as any[],
  };

  const altSet = new Set<string>();
  const mapSet = new Set<number>();

  for (const row of rows) {
    // ✅ alternative names
    if (row.alternative_name) {
      altSet.add(row.alternative_name);
    }

    // ✅ mappings
    if (row.mapping_id && !mapSet.has(row.mapping_id)) {
      mapSet.add(row.mapping_id);

      product.mappings.push({
        mapping_id: row.mapping_id,
        category_id: row.category_id,
        category_name: row.category_name,
        category_type: row.category_type,
        primary_category_id: row.primary_category_id,
        primary_category_name: row.primary_category_name,
        brand_id: row.brand_id,
        brand_name: row.brand_name,
      });
    }
  }

  product.alternative_names = Array.from(altSet);

  return product;
};
