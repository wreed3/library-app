package com.libraryyourway.springbootlibrary.requestmodels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
public class ReviewRequest {

    private Long bookId;
    private double rating;
    private Optional<String> reviewDescription;

}
