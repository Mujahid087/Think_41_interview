const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Import models
const Product = require('../models/Product');
const InventoryItem = require('../models/InventoryItem');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const DistributionCenter = require('../models/DistributionCenter');

async function loadCSV(Model, filePath, transformer = row => row) {
  return new Promise((resolve, reject) => {
    const results = [];

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    console.log(`📂 Loading ${Model.modelName} from ${filePath}...`);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => {
        try {
          const transformedRow = transformer(row);
          results.push(transformedRow);
        } catch (err) {
          console.warn(`⚠️ Skipping invalid row in ${Model.modelName}:`, err.message);
        }
      })
      .on('end', async () => {
        try {
          if (results.length === 0) {
            console.log(`📝 No valid records found in ${Model.modelName}`);
            resolve();
            return;
          }

          // Clear existing data (optional - remove if you want to append)
          await Model.deleteMany({});
          console.log(`🗑️ Cleared existing ${Model.modelName} data`);

          await Model.insertMany(results);
          console.log(`✅ Loaded ${results.length} records into ${Model.modelName}`);
          resolve();
        } catch (err) {
          console.error(`❌ Failed to load ${Model.modelName}:`, err);
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error(`❌ Error reading ${filePath}:`, err);
        reject(err);
      });
  });
}

async function main() {
  try {
    // Assuming MongoDB connection is already established elsewhere
    console.log('📊 Starting data loading process...');
    
    // Updated path to your CSV folder
    const basePath = path.join(__dirname, '../../../Think_41_interview/backend/csv');
    
    console.log(`📁 CSV files directory: ${basePath}`);

    await loadCSV(DistributionCenter, `${basePath}/distribution_centers.csv`, row => ({
      id: row.id,
      name: row.name,
      latitude: parseFloat(row.latitude) || 0,
      longitude: parseFloat(row.longitude) || 0
    }));

    await loadCSV(Product, `${basePath}/products.csv`, row => ({
      id: row.id,
      cost: parseFloat(row.cost) || 0,
      category: row.category || '',
      name: row.name || '',
      brand: row.brand || '',
      retail_price: parseFloat(row.retail_price) || 0,
      department: row.department || '',
      sku: row.sku || '',
      distribution_center_id: row.distribution_center_id || ''
    }));

    await loadCSV(User, `${basePath}/users.csv`, row => ({
      id: row.id,
      first_name: row.first_name || '',
      last_name: row.last_name || '',
      email: row.email || '',
      age: parseInt(row.age) || 0,
      gender: row.gender || '',
      state: row.state || '',
      street_address: row.street_address || '',
      postal_code: row.postal_code || '',
      city: row.city || '',
      country: row.country || '',
      latitude: parseFloat(row.latitude) || 0,
      longitude: parseFloat(row.longitude) || 0,
      traffic_source: row.traffic_source || '',
      created_at: row.created_at ? new Date(row.created_at) : new Date()
    }));

    await loadCSV(InventoryItem, `${basePath}/inventory_items.csv`, row => ({
      id: row.id,
      product_id: row.product_id || '',
      created_at: row.created_at ? new Date(row.created_at) : new Date(),
      sold_at: row.sold_at ? new Date(row.sold_at) : null,
      cost: parseFloat(row.cost) || 0,
      product_category: row.product_category || '',
      product_name: row.product_name || '',
      product_brand: row.product_brand || '',
      product_retail_price: parseFloat(row.product_retail_price) || 0,
      product_department: row.product_department || '',
      product_sku: row.product_sku || '',
      product_distribution_center_id: row.product_distribution_center_id || ''
    }));

    await loadCSV(Order, `${basePath}/orders.csv`, row => ({
      order_id: row.order_id,
      user_id: row.user_id || '',
      status: row.status || '',
      gender: row.gender || '',
      created_at: row.created_at ? new Date(row.created_at) : new Date(),
      returned_at: row.returned_at ? new Date(row.returned_at) : null,
      shipped_at: row.shipped_at ? new Date(row.shipped_at) : null,
      delivered_at: row.delivered_at ? new Date(row.delivered_at) : null,
      num_of_item: parseInt(row.num_of_item) || 1
    }));

    await loadCSV(OrderItem, `${basePath}/order_items.csv`, row => ({
      id: row.id,
      order_id: row.order_id || '',
      user_id: row.user_id || '',
      product_id: row.product_id || '',
      inventory_item_id: row.inventory_item_id || '',
      status: row.status || '',
      created_at: row.created_at ? new Date(row.created_at) : new Date(),
      shipped_at: row.shipped_at ? new Date(row.shipped_at) : null,
      delivered_at: row.delivered_at ? new Date(row.delivered_at) : null,
      returned_at: row.returned_at ? new Date(row.returned_at) : null
    }));

    console.log('\n🎉 All data loaded successfully!');
    console.log('\n📈 Data loading summary completed.');
    
  } catch (error) {
    console.error('\n❌ Error loading data:', error);
    throw error; // Re-throw to let calling function handle it
  }
}

// Export the main function for use in other files
module.exports = { main, loadCSV };

// Only run directly if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}