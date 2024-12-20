---
sidebar_label: 'config-center-demo'
sidebar_position: 4
---


# 简介
config_center_demo 是一个配置中心的 C Clientdemo，主要功能包括：登入待秘钥账户，主动更新或被动更新配置。

# 项目搭建
下载 Apollo C  客户端代码， 集成json-c库源码，集成 Curl OpenSSL。
项目配置项: "将警告视为错误" 设置成 "否"。

# 参考
[Apollo C 客户端](https://www.apolloconfig.com/#/zh/client/c-sdks-user-guide?id=apollo-c-%e5%ae%a2%e6%88%b7%e7%ab%af)

[http api 接入指南](https://www.apolloconfig.com/#/zh/client/other-language-client-user-guide)

# 遇到的问题
1.c c++ 代码混合编译报错


# 账号信息
```json
AppID:          "Reiboot",
Cluster:        "test",
IP:             "https://apollo-test.afirstsoft.cn:8443",
NamespaceName:  "tsbd",
Secret:         "3732d6825d7849978e26d2f4d09a578e",
```

# apolloclient.h 文件修改
## 线程函数Api 替换
pthread_createv 线程方法替换成Windows Api_beginthread。
## 预定义宏值替换
```c
#define APOLLO_CONFIG_NOCACHE_URL "%s/configs/%s/%s/%s"
#define APOLLO_CONFIG_NOTI_URL "%s/notifications/v2?appId=%s&cluster=%s&notifications=%s"
```

## apollo_env 结构新增成员
```c
typedef struct {
		String meta; //apollometa服务器ip和地址
		String appId;//应用名称,比如网关gateway
		String clusterName;//集群名称，默认default
		String namespaceName;//命名空间名称 如application.ymal
		String secret;
		//String sign;
		//String timestamp;
	} apollo_env;
```
# apollo_client.c 文件修改
## 函数 getNoCachePropertyString 内参数适配 
设置curl 通用 header 头信息
```c
void* timestampHandle = createTimeStamp();
char* timestamp = getHandleString(timestampHandle);
void* pathWithQueryHandle = CreatePathWithQuery(urlDest, apolloEnv.meta);
char* pathWithQuery = getHandleString(pathWithQueryHandle);
void* strToSignHandle = StrToSign(timestamp, pathWithQuery);
void* signHandle = createSign(getHandleString(strToSignHandle), apolloEnv.secret);
char* sign = getHandleString(signHandle);
String tokenHeader = sprintfStr("Apollo %s:%s", apolloEnv.appId, sign);
struct curl_slist *headers =setCommonHeader(&res, tokenHeader, timestamp);
```

忽略ssl 验证
```c
curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
```
## 函数 checkNotifications 内参数适配
设置curl 通用 header 头信息
```c
void* timestampHandle = createTimeStamp();
char* timestamp = getHandleString(timestampHandle);
void* pathWithQueryHandle = CreatePathWithQuery(urlDest, apolloEnv.meta);
char* pathWithQuery = getHandleString(pathWithQueryHandle);
void* strToSignHandle = StrToSign(timestamp, pathWithQuery);
void* signHandle = createSign(getHandleString(strToSignHandle), apolloEnv.secret);
char* sign = getHandleString(signHandle);
String tokenHeader = sprintfStr("Apollo %s:%s", apolloEnv.appId, sign);
struct curl_slist *headers =setCommonHeader(&res, tokenHeader, timestamp);
```
忽略ssl 验证
```c
curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
```
## 函数 submitNotifications 内参数适配
第一次获取资源信息分配内存
```c
//Properties oldProperties;
Properties *poldProperties = NULL;
poldProperties = (Properties*)malloc(sizeof(Properties));
getNoCacheProperty(apolloEnv,poldProperties);
callback(NULL, poldProperties);
long responseCode;
String notiStr=newString(1000);
memset(notiStr, 0, 1000);
//Properties newProperties;
Properties *pnewProperties = (Properties*)malloc(sizeof(Properties));
```

```c
*poldProperties =*pnewProperties;
//                    newProperties.len=0;
//                    free(newProperties.keys);
//                    free(newProperties.values);
```

# 秘钥加密处理
```c HmacSha1Utils.cpp
std::string base64_encode(const std::string &input) {
	BIO *bio, *b64;
	BUF_MEM *bufferPtr;

	b64 = BIO_new(BIO_f_base64());
	bio = BIO_new(BIO_s_mem());
	bio = BIO_push(b64, bio);

	BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL); // Ignore newlines - write everything in one line
	BIO_write(bio, input.c_str(), input.length());
	BIO_flush(bio);
	BIO_get_mem_ptr(bio, &bufferPtr);
	std::string output(bufferPtr->data, bufferPtr->length);
	BIO_free_all(bio);

	return output;
}

std::string hmac_sha1(const std::string &key, const std::string &data) {
	unsigned char* result;
	unsigned int result_len;

	result = HMAC(EVP_sha1(), key.c_str(), key.length(), (unsigned char*)data.c_str(), data.length(), NULL, &result_len);
	if (result == NULL) {
		throw std::runtime_error("HMAC calculation failed");
	}

	return std::string((char*)result, result_len);
}

std::string signString(const std::string &stringToSign, const std::string &accessKeySecret) {
	std::string hmacResult = hmac_sha1(accessKeySecret, stringToSign);
	return base64_encode(hmacResult);
}
```
# 日期转时间戳
```c title=SignInfoWraper.cpp
// 创建一个新的字符串
void* createTimeStamp()
{
	return new std::string(GetCurTimeStamp());
}


void* createSign(const char* strToSign, const char* secret)
{
	return new std::string(signString(strToSign, secret));
}
// 获取字符串内容
const char* getHandleString(void* handle)
{
	std::string* str = static_cast<std::string*>(handle);
	return str->c_str(); // 返回 C 风格的字符串指针
}
// 销毁字符串对象
void destroyHandle(void* handle)
{
	std::string* str = static_cast<std::string*>(handle);
	delete str; // 释放 std::string 对象的内存
}

void* CreatePathWithQuery(const char* urlDest, const char* server)
{
	std::string strUrlDest(urlDest);
	std::string strServer(server);
	std::size_t nSize = strUrlDest.find_first_of(strServer);
	std::string substr = nSize >= 0 ? strUrlDest.substr(nSize + strServer.size()) : "";
	return new std::string(substr);
}

void* StrToSign(const char* timestamp, const char* pathWithQuery)
{
	std::string strTimestamp(timestamp);
	std::string strPathWithQuery(pathWithQuery);

	return new std::string(strTimestamp + "\n" + strPathWithQuery);//"your string to sign";
}
```
```c title=SignInfo.cpp
// 辅助函数：将FILETIME转换为毫秒  
uint64_t FileTimeToMillisecondsSinceEpoch(const FILETIME& ft) {
	// FILETIME是自1601年1月1日以来的100纳秒间隔数  
	// 首先转换为自1601年1月1日以来的秒数  
	ULARGE_INTEGER uli;
	uli.LowPart = ft.dwLowDateTime;
	uli.HighPart = ft.dwHighDateTime;

	// Windows的epoch是1601年1月1日，Unix的epoch是1970年1月1日  
	// 两者相差的秒数为：(1970 - 1601) * 365 * 24 * 60 * 60 = 11644473600  
	// 注意：这里没有考虑闰秒和闰年，但对于大多数应用来说已经足够精确  
	const uint64_t epochDiff = 11644473600ULL;

	// 将100纳秒转换为毫秒，然后加上epoch差异，得到结果  
	return (uli.QuadPart / 10000) - epochDiff * 1000;
}

std::string GetTimeStamp(uint64_t millisecondsSinceEpoch)
{
	return std::to_string(millisecondsSinceEpoch);
}

std::string GetCurTimeStamp()
{
	FILETIME ft;
	GetSystemTimeAsFileTime(&ft);
	uint64_t millisecondsSinceEpoch = FileTimeToMillisecondsSinceEpoch(ft);
	std::string timestamp = std::to_string(millisecondsSinceEpoch);
	return timestamp;
}
```

# 启动
```c title=apolloConfigWin32Demo.cpp
	const char* AppID = "Reiboot";
	const char* Cluster = "test";
	const char* IP = "https://apollo-test.afirstsoft.cn:8443";
	const char* NamespaceName = "test";
	const char* Secret = "3732d6825d7849978e26d2f4d09a578e";

    apollo_env env;
	env.meta = new char[100];
	env.appId = new char[100];
	env.clusterName = new char[100];
	env.namespaceName = new char[100];
	env.secret = new char[100];
	memset(env.meta, 0, 100);
	memcpy(env.meta, IP, strlen(IP) * sizeof(char));
	memset(env.appId, 0, 100);
	memcpy(env.appId, AppID, strlen(AppID) * sizeof(char));
	memset(env.clusterName, 0, 100);
	memcpy(env.clusterName, Cluster, strlen(Cluster) * sizeof(char));
	memset(env.namespaceName, 0, 100);
	memcpy(env.namespaceName, NamespaceName, strlen(NamespaceName) * sizeof(char));
	memset(env.secret, 0, 100);
	memcpy(env.secret, Secret, strlen(Secret) * sizeof(char));

#pragma region apollocclient api
	char* p = getNoCachePropertyString(env);
	if(p) printf("\n%s",p);

	Properties prop;
	getNoCacheProperty(env, &prop);
	
	notification notifi = {0};
	notifi.namespaceName = new char[100];
	memset(notifi.namespaceName, 0, 100);
	memcpy(notifi.namespaceName, NamespaceName, strlen(NamespaceName) * sizeof(char));
	notifi.notificationId = -1;
	int flag = 0;
	//submitNotifications(env, notifi, &flag, submitCallback);
	submitNotificationsAsync(env, notifi, &flag, submitCallback);
#pragma endregion


#pragma region apolloc api

#pragma endregion

	Sleep(1000 * 60 * 60);

	free(env.appId);
	free(env.clusterName);
	free(env.meta);
	free(env.namespaceName);
	free(env.secret);
```