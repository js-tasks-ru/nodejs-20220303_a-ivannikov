const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  console.log(`categoryList invoked`);
  const categories = await Category.find();
  ctx.body = {categories: categories.map(mapCategory)};
};
