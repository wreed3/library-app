package com.libraryyourway.springbootlibrary.service;

import com.libraryyourway.springbootlibrary.entity.Review;
import com.libraryyourway.springbootlibrary.entity.dao.ReviewRepository;
import com.libraryyourway.springbootlibrary.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.sql.Date;


@Service
@Transactional
public class ReviewService {
    @Autowired
    ReviewRepository reviewRepository;

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {

        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());


        if (validateReview != null) {
            throw new Exception("Review has already been created");
        }

        Review review = new Review();
        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        review.setDate(Date.valueOf(LocalDate.now()));

        if (reviewRequest.getReviewDescription().isPresent()) {
            review.setReviewDescription(reviewRequest.getReviewDescription().map(Object :: toString).orElse(null));
        }
        reviewRepository.save(review);
    };

    public Boolean userReviewListed(String userEmail, Long bookId){
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        return validateReview != null;
    }
}
