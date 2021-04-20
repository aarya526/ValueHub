package com.hakke.ecommerce.dto;

public class PurchaseResponse {

	private String orderTrackingNumber;

	public PurchaseResponse(String orderTrackingNumber) {

		this.orderTrackingNumber = orderTrackingNumber;
	}

	public final String getOrderTrackingNumber() {
		return orderTrackingNumber;
	}

	public final void setOrderTrackingNumber(String orderTrackingNumber) {
		this.orderTrackingNumber = orderTrackingNumber;
	}

	@Override
	public String toString() {
		return "PurchaseResponse [orderTrackingNumber=" + orderTrackingNumber + "]";
	}

}
