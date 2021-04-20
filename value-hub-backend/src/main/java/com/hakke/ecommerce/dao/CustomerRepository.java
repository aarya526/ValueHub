package com.hakke.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hakke.ecommerce.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
