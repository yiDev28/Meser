export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  urlImage: string;
  imagePath: string;
  productCategory: ProductCategoryDTO;
}

export interface ProductCategoryDTO {
  id: number;
  name: string;
  urlImage: string;
  imagePath: string;
}
