package com.sun366.util;

import java.util.UUID;



public class CommonUtil {
	public static String uid(){
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
}
