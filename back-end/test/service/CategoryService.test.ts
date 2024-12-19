import categoryService from "../../service/Category.service";
import * as categoryDb from "../../repository/Category.db";
import { CategoryInput } from "../../types";

jest.mock("../../repository/Category.db");

describe("Category Service", () => {
  describe("createCategory", () => {
    it("should create a category with valid data", async () => {
      const categoryData: CategoryInput = {
        naam: "Technology",
        beschrijving: "All about technology",
      };

      (categoryDb.createCategory as jest.Mock).mockResolvedValue({
        id: 1,
        ...categoryData,
      });

      const result = await categoryService.createCategory(categoryData);
      expect(result).toEqual({ id: 1, ...categoryData });
      expect(categoryDb.createCategory).toHaveBeenCalledWith(categoryData);
    });

    it("should throw an error if naam or beschrijving is missing", async () => {
      const invalidCategoryData = { naam: "", beschrijving: "Missing name" };
      await expect(
        categoryService.createCategory(invalidCategoryData as CategoryInput)
      ).rejects.toThrow("Name and description are required to create a category.");
    });
  });

  describe("getAllCategories", () => {
    it("should fetch all categories", async () => {
      const categories = [
        { id: 1, naam: "Technology", beschrijving: "Tech-related topics" },
        { id: 2, naam: "Science", beschrijving: "Science-related topics" },
      ];

      (categoryDb.getAllCategories as jest.Mock).mockResolvedValue(categories);

      const result = await categoryService.getAllCategories();
      expect(result).toEqual(categories);
      expect(categoryDb.getAllCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCategoryById", () => {
    it("should fetch a category by its ID", async () => {
      const category = { id: 1, naam: "Technology", beschrijving: "Tech-related topics" };
      (categoryDb.getCategoryById as jest.Mock).mockResolvedValue(category);

      const result = await categoryService.getCategoryById(1);
      expect(result).toEqual(category);
      expect(categoryDb.getCategoryById).toHaveBeenCalledWith({ id: 1 });
    });

    it("should throw an error if no ID is provided", async () => {
      await expect(categoryService.getCategoryById(undefined as unknown as number)).rejects.toThrow(
        "Category ID is required."
      );
    });
  });

  describe("updateCategory", () => {
    it("should update a category with valid data", async () => {
      const updatedData: Partial<CategoryInput> = {
        naam: "Updated Name",
        beschrijving: "Updated Description",
      };

      (categoryDb.updateCategory as jest.Mock).mockResolvedValue({
        id: 1,
        ...updatedData,
      });

      const result = await categoryService.updateCategory(1, updatedData);
      expect(result).toEqual({ id: 1, ...updatedData });
      expect(categoryDb.updateCategory).toHaveBeenCalledWith(1, updatedData);
    });
  });

 
});
