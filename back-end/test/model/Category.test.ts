import { Category } from '../../domain/model/Category';

describe('Category', () => {
    it('should create a category with valid data', () => {
        const category = new Category({
            id: 1,
            naam: 'Technology',
            beschrijving: 'All about technology',
        });

        expect(category.id).toBe(1);
        expect(category.naam).toBe('Technology');
        expect(category.beschrijving).toBe('All about technology');
    });

    it('should throw an error if naam is empty', () => {
        expect(() => {
            new Category({
                id: 1,
                naam: '',
                beschrijving: 'All about technology',
            });
        }).toThrow('Category name is required.');
    });

    it('should throw an error if beschrijving is empty', () => {
        expect(() => {
            new Category({
                id: 1,
                naam: 'Technology',
                beschrijving: '',
            });
        }).toThrow('Category description is required.');
    });
});
