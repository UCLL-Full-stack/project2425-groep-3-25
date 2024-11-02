export class Category {
    readonly id: number;
    readonly naam: string;
    readonly beschrijving: string;
  
    constructor(category: { id: number; naam: string; beschrijving: string }) {
      this.validate(category);
  
      this.id = category.id;
      this.naam = category.naam;
      this.beschrijving = category.beschrijving;
    }
  
    private validate(category: { id: number; naam: string; beschrijving: string }) {
      if (!category.naam?.trim() || !category.beschrijving?.trim()) {
        throw new Error('All fields are required.');
      }
    }
  
}