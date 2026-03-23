import pool from "../../config/db";

export class MovementRepository {

  async createMovement(connection:any,data:any){

  const {
    business_id,
    product_id,
    stock_id,
    variant_id,
    stock_type_id,
    movement_type,
    qty,
    storage_location_id,
    reference_type,
    reference_id
  } = data;

  await connection.execute(
    `INSERT INTO stock_movements
    (business_id,product_id,stock_id,variant_id,stock_type_id,
     movement_type,qty,storage_location_id,reference_type,reference_id)
    VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      business_id,
      product_id,
      stock_id,
      variant_id,
      stock_type_id,
      movement_type,
      qty,
      storage_location_id ?? null,   // FIX HERE
      reference_type,
      reference_id
    ]
  );

}

}