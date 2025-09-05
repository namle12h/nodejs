import express, { NextFunction } from "express";

import createError from "http-errors";

const router = express.Router();

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Books" },
  { id: 3, name: "Clothing" }
];
// get /api/v1/categories
// get all categories
router.get("/categories", (req, res) => {
  res.status(200).json({
    message: "Categories route is working",
    data: categories,
  });
});   

router.get("/categories/:id", (req, res, next : NextFunction) => {
  const categoryId = parseInt(req.params.id, 10);
  const category = categories.find(cat => cat.id === categoryId);   
  // nếu tìm thấy category  
  if (category) {
    res.status(200).json({
      message: "Category found",
      data: category,
    });
  } else {
    throw createError(404, "Category not found");
  }
})

router.post("/categories", (req, res) => {
  console.log(req.body);
  const newCategory = {
    id: categories.length + 1, // tạo id mới cho category
    name: req.body.name, // lấy tên category từ body của request
  };
  categories.push(newCategory); // thêm category mới vào mảng categories
  
  res.status(201).json({
    message: "Category created successfully",
    data: newCategory, // trả về category mới đã tạo
  });
});

router.put("/categories/:id", (req, res, next : NextFunction) => {
  const categoryId = parseInt(req.params.id, 10);   
  const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
  if (categoryIndex !== -1) { 
    const updatedCategory = {
      ...categories[categoryIndex],
      name: req.body.name, // cập nhật tên category từ body của request
    };
    categories[categoryIndex] = updatedCategory; // cập nhật category trong mảng categories
    
    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory, // trả về category đã cập nhật
    });
  } else {
    throw createError(404, "Category not found");
  }   
});

export default router;