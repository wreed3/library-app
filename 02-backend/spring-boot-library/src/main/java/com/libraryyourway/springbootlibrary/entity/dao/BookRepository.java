package com.libraryyourway.springbootlibrary.entity.dao;

import com.libraryyourway.springbootlibrary.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {

}
