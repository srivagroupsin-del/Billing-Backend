// import pool from "../config/db";

// /**
//  * Generate next code like SEC001, CAT002, etc.
//  */
// export const generateCode = async (options: {
//   table: string;
//   column: string;
//   prefix: string;
//   padLength?: number;
// }): Promise<string> => {
//   const { table, column, prefix, padLength = 3 } = options;

//   // Get latest code
//   const [rows]: any = await pool.query(
//     `SELECT ${column} 
//      FROM ${table}
//      WHERE ${column} LIKE ?
//      ORDER BY id DESC
//      LIMIT 1`,
//     [`${prefix}%`]
//   );

//   let nextNumber = 1;

//   if (rows.length) {
//     const lastCode: string = rows[0][column];
//     const numberPart = lastCode.replace(prefix, "");
//     nextNumber = parseInt(numberPart, 10) + 1;
//   }

//   const paddedNumber = String(nextNumber).padStart(padLength, "0");

//   return `${prefix}${paddedNumber}`;
// };
