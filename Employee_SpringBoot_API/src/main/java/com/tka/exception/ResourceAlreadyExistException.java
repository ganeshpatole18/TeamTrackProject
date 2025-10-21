package com.tka.exception;

public class ResourceAlreadyExistException extends Exception {
	
	private static final long serialVersionUID = 1L;

	public ResourceAlreadyExistException(String message) {
		super(message);
	}

	public ResourceAlreadyExistException(String message, Throwable cause) {
		super(message, cause);
	}

}
