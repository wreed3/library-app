export interface ReviewModel {
	id: number;
	userEmail: string;
	date: Date;
	rating: number;
	bookId: number;
	reviewDescription: string;
}
