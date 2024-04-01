package com.libraryyourway.springbootlibrary.responsemodels;

import com.libraryyourway.springbootlibrary.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShelfCurrentLoansResponse {

    private Book book;
    private int daysLeft;

}
