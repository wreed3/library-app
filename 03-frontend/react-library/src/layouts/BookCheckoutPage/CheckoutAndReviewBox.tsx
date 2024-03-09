import { BookModel } from '../../models/BookModel';

interface CheckoutAndReviewBoxProps {
	book: BookModel | undefined;
	mobile: boolean;
}

export const CheckoutAndReviewBox = ({
	book,
	mobile,
}: CheckoutAndReviewBoxProps) => {
	return (
		<div
			className={
				mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'
			}
		>
			<div className=""></div>
		</div>
	);
};
