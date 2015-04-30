package com.sun366.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

/*--------------------------------
功能:		快讯短信 PHP HTTP接口 发送短信
修改日期:	2014-04-12
说明:		http://api.106msg.com/TXTJK.aspx?type=send&ua=*****&pwd=*****&gwid=***&mobile=手机号1,手机号2,手机号3&msg=【签名】短信内容 
状态:

1   发送短信成功(其他请求代表成功)
-1  账号无效或未开户
-2  账号密码错误
-3  下发手机号为空
-4  下发短信内容为空
-5  指定短信企业ID为空
-6  账户或密码错误
-7  账户被冻结
-8  下发短信内容包含非法关键词
-9  账户没有充值或指定企业ID错误
-10 下发短信内容长度超出规定限制，限制为350字符
-11 下发账号余额不足
-20 服务器连接异常
-21 当前短信隶属106营销短信 必须加“尊称”、“退订回复T”
-99 系统未知错误

--------------------------------*/
public class sendSMS {

	/**
	 * @param args
	 * @throws IOException
	 */
	public static void test() throws IOException {
		//发送内容
		String msg = "【运动磁场】您的验证码是：37864"; 
		
		// 创建StringBuffer对象用来操作字符串
		StringBuffer sb = new StringBuffer("http://api.106msg.com/TXTJK.aspx?");

		// 向StringBuffer追加用户名
		sb.append("type=send&ua=1306040659");

		// 向StringBuffer追加密码 
		sb.append("&pwd=1306040659");

		// 向StringBuffer追加网关id
		sb.append("&gwid=39");

		// 向StringBuffer追加手机号码
		sb.append("&mobile=15927446476,15527038394");

		// 向StringBuffer追加消息内容转URL标准码
		sb.append("&msg="+URLEncoder.encode(msg));

		// 创建url对象
		URL url = new URL(sb.toString());

		// 打开url连接
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();

		// 设置url请求方式 ‘get’ 或者 ‘post’
		connection.setRequestMethod("POST");

		// 发送
		BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

		// 返回发送结果
		String inputline = in.readLine();

		// 返回结果为‘100’ 发送成功
		System.out.println(inputline);

	}

}
