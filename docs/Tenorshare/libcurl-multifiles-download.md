---
sidebar_label: 'libcurl-multifiles-download'
sidebar_position: 2
---

# 简介
封装了libcurl用于支持同时下载多个大文件、多线程并发分片下载。

# 问题
1. 打开文件模式 ab;
2. curl下载单个超4G大小文件需使用CURLOPT_RESUME_FROM_LARGE 选项;

# 职责
CDownloadTaskManager： 提供添加文件下载接口，调度并分配多个文件下载任务。
CFileTaskInfo: 对片处理，从线程池中取出一个线程，执行单个文件下载任务，并回调下载进度。
CCurlDownloader: 封装libcurl，提供下载功能。
threadpool： 线程池。

# 数据结构
## CurlTaskInfo
```cpp
//下载任务信息
//这里必须是struct而不能是class
struct CurlTaskInfo
{
	CurlTaskInfo() : fp(nullptr), originPos(0), startPos(0), stopPos(0), lastPos(0), ranged(false), remoteFileLength(0), nIndex(0), pDownloaderCallback(nullptr)
	{
		pDownloader = nullptr;
		curl = nullptr;
	}

	CurlTaskInfo(
		FILE* _fp, 
		const std::string _url, 
		//CURL *_pCurl, 
		bool _ranged, 
		size_t _remoteFileLength, 
		size_t _startPos, 
		size_t _stopPos, 
		unsigned int _nIndex, 
		CFileTaskInfo* _pFileTaskInfo,
		CDownloaderCallback* pDownloadCallback): curl(nullptr), pFileTaskInfo(nullptr), pDownloader(nullptr),
		pDownloaderCallback(pDownloadCallback)
	{
		fp = _fp;
		url = _url;
		//curl = _pCurl;
		ranged = _ranged;
		remoteFileLength = _remoteFileLength;
		startPos = _startPos;
		stopPos = _stopPos;
		originPos = _startPos;
		lastPos = _startPos;
		nIndex = _nIndex;
		//pDownloader = _pDownloader;
		pFileTaskInfo = _pFileTaskInfo;
	}

	FILE*    fp;				//本地文件句柄
	std::string  url;			//url 
	CURL*	curl;				//curl 对象
	bool    ranged;				//是否需要 http range下载?
	size_t	remoteFileLength;	//文件总长度

	size_t	 originPos;			//分段起始点
	size_t   lastPos;			//进度上一个位置
	size_t   startPos;			//进度当前位置
	size_t   stopPos;			//分段终点
	unsigned int nIndex;		//分段索引

	CFileTaskInfo * pFileTaskInfo;
	CCurlDownloader* pDownloader;
	CDownloaderCallback* pDownloaderCallback;
};
```

# CDownloadTaskManager
## 添加下载文件到队列
```cpp
void CDownloadTaskManager::DownloadFile(const char* url, const char* name, CDownloaderCallback* pCallback)
{
	CFileTaskInfo* pInfo = new CFileTaskInfo(url, name, pCallback, true, m_nLimitThread);
	m_lstFileTaskInfo.push_back(pInfo);

	if (m_hThread == nullptr)
	{
		m_hThread = (HANDLE)_beginthreadex(NULL, 0, (_beginthreadex_proc_type)DownloadFileCallback, (void*)this, 0, 0);
	}
	else
	{
		NotifyEvent();
	}
}
```

## 从队列中取出一个文件下载任务，并执行下载
```cpp
void CDownloadTaskManager::DoingTask()
{
	while (true)
	{
		if (m_lstFileTaskInfo.empty())
		{
			WaitForSingleObject(m_hEvent, INFINITE);
			continue;
		}
		else
		{
			list<CFileTaskInfo*>::iterator iter = m_lstFileTaskInfo.begin();
			size_t nDoingCount = 0;
			while (iter != m_lstFileTaskInfo.end())
			{
				if ((*iter)->isDoing())
				{
					++nDoingCount;
				}
				else
				{
					// 移除已完成的下载文件任务
					if (!(*iter)->getTotalTaskCount())
					{
						iter = m_lstFileTaskInfo.erase(iter);
						continue;
					}
				}
				iter++;
			}
			int nMinLimit = m_lstFileTaskInfo.size() < m_nLimitFiles ? m_lstFileTaskInfo.size() : m_nLimitFiles;
			if (nDoingCount >= nMinLimit)
			{
				WaitForSingleObject(m_hEvent, INFINITE);
				continue;
			}

			iter = m_lstFileTaskInfo.begin();
			while (iter != m_lstFileTaskInfo.end())
			{
				if ((*iter)->getTotalTaskCount() && !(*iter)->isDoing())
				{
					(*iter)->DoingTask();
				}
				iter++;
			}
		}
	}
}
```
## 停止下载
```cpp
void CDownloadTaskManager::Stop(const char* url)
{
	std::list<CFileTaskInfo*>::iterator iter = m_lstFileTaskInfo.begin();

	while (iter != m_lstFileTaskInfo.end())
	{
		if (!(*iter)->isDifferentUrl(url))
		{
			(*iter)->Stop();
		}
		iter++;
	}
}
```

# CFileTaskInfo
## 分片处理
```cpp
bool CFileTaskInfo::GenerateTaskInfos(const std::string& urls, const std::string& localDirPath, bool bRanged)
{
	// 初始化变量
	bool bResult = false;
	FILE* fp;
	size_t file_len = 0, start=0, stop=0, seg_num=0;
	bool ranged = bRanged;
	CurlTaskInfo* pTi= nullptr;

	// 取远程文件大小
	file_len = CCurlDownloader::getDownloadFileSize(urls.c_str());
	if (file_len <= 0) return bResult;
	m_llFileLength = file_len;

	// 文件名
	size_t nIndex = localDirPath.find_last_of('\\');
	string fileName = localDirPath.substr(nIndex + 1, localDirPath.length() - nIndex);

	//对应每个url, 打开一个本地文件
	string full_path = localDirPath.c_str();
	size_t local_file_len = CFileHelper::GetFileLength(full_path);
	fp = fopen(full_path.c_str(), "wb+"); //打开文件
	if (nullptr == fp) return bResult;

	m_CloseTaskInfo.fp = fp;
	m_CloseTaskInfo.url = urls;
	

	//加入全局任务监听映射
	size_t additional = (file_len % m_segSize == 0) ? 0 : 1;
	size_t seg_total = ranged ? (file_len < m_segSize ? 1 : (file_len / m_segSize + additional)) : 1;
	m_nTotalTask = (int)seg_total;

	if (ranged)
	{
		//根据文件大小, 确定是否分片?
		if (file_len < m_segSize)
		{
			start = 0;
			stop = file_len - 1;
			pTi = new CurlTaskInfo(fp, urls.c_str(), ranged, file_len, start, stop, 0, this, nullptr);
			m_vecCurlTaskInfo.push_back(pTi);
		}
		else
		{
			//分片下载,先确定分片个数
			seg_num = file_len / m_segSize;
			for (size_t i = 0; i < (seg_num + additional); i++) {
				if (i < seg_num) {
					start = i * m_segSize;
					stop = (i + 1) * m_segSize - 1;
				}
				else {
					if (file_len % m_segSize != 0) {
						start = i * m_segSize;
						stop = file_len - 1;
					}
					else
						break;
				}
				pTi = new CurlTaskInfo(fp, urls.c_str(), ranged, file_len, start, stop, (int)i, this, nullptr);
				m_vecCurlTaskInfo.push_back(pTi);
			}
		}
	}
	else
	{
		start = (local_file_len > 0) ? (local_file_len) : 0;
		stop = file_len - 1;
		pTi = new CurlTaskInfo(fp, urls.c_str(), ranged, file_len, start, stop, 0, this, nullptr);
		
		m_vecCurlTaskInfo.push_back(pTi);
	}


	return bResult;
}
```
## 对每个分片job进行处理
```cpp
void CFileTaskInfo::DoingTask()
{
	m_pCallback->OnDownloadBegin();
	m_bDoing = true;

	std::vector< std::future<CurlTaskInfo*>> results;
	for (int i = 0; i < m_vecCurlTaskInfo.size(); i++)
	{
		CurlTaskInfo* cti = m_vecCurlTaskInfo[i];
		results.emplace_back(
			m_ppools->commit([cti] {
			do {
				CCurlDownloader *p = new CCurlDownloader(cti->pFileTaskInfo, cti->pDownloaderCallback);
				p->Start(cti);
			} while (cti->startPos < cti->stopPos);
			
			return cti;
		})
		);
	}
}
```
# CCurlDownloader
## 下载单个分片
```cpp  
bool CCurlDownloader::taskProcess(void *arg)
{
	bool bResult = false;
	CURL* curl;
	CURLcode res;
	CurlTaskInfo* ti = (CurlTaskInfo*)arg;
	ti->pDownloader = this;

	char range[64] = { 0 };
	if (ti->ranged) {
		snprintf(range, sizeof(range), "%llu-%llu", ti->startPos, ti->stopPos);
	}

	curl = curl_easy_init();
	curl_easy_setopt(curl, CURLOPT_URL, ti->url.c_str());
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeData);
	curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void*)ti);
	curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
	curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 3);//查找次数，防止查找太深
	curl_easy_setopt(curl, CURLOPT_AUTOREFERER, 1L);
	curl_easy_setopt(curl, CURLOPT_NOSIGNAL, 1L);
	curl_easy_setopt(curl, CURLOPT_LOW_SPEED_LIMIT, 1L);
	curl_easy_setopt(curl, CURLOPT_LOW_SPEED_TIME, 5L);
	curl_easy_setopt(curl, CURLOPT_FORBID_REUSE, 1L);
	curl_easy_setopt(curl, CURLOPT_XFERINFOFUNCTION, curlProgressFunc);
	curl_easy_setopt(curl, CURLOPT_XFERINFODATA, (void*)ti);
	curl_easy_setopt(curl, CURLOPT_NOPROGRESS, false);//设为false 下面才能设置进度响应函数
	//curl_easy_setopt(curl, CURLOPT_RESUME_FROM_LARGE, ti->startPos);//断点下载设置
	//curl_easy_setopt(curl, CURLOPT_BUFFERSIZE, 1024*10);//断点下载设置
	//curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 5);//设置连接超时，单位秒
	///*
	curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
	curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
	curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
	//*/
	/*
	curl_easy_setopt(curl, CURLOPT_PROGRESSFUNCTION, CurlProgressFunc);//进度响应函数
	curl_easy_setopt(curl, CURLOPT_PROGRESSDATA, (void*)ji);//数据传输的对象
	//*/

	if (ti->ranged)
		curl_easy_setopt(curl, CURLOPT_RANGE, range);
	ti->curl = curl;
	res = curl_easy_perform(curl);
	if (CURLE_OK != res) 
	{ 
		//TRACE(L"curl_easy_perform return %d\n", res);
	}
	curl_easy_cleanup(curl);

	if (CURLE_OK == res && (ti->startPos == (ti->stopPos + 1)))
	{
		m_pParent->decreaseTotalTask();
	}
	else
	{
		m_pParent->resetTask(ti);
	}

	bResult = (CURLE_OK == res) && (ti->startPos == (ti->stopPos + 1));
	return bResult;
}
```

## 进度
```cpp
int CCurlDownloader::curlProgressFunc(void *ptr, size_t totalToDownload, size_t nowDownloaded, size_t totalToUpLoad, size_t nowUpLoaded)
{
	CurlTaskInfo* ji = (CurlTaskInfo*)ptr;
	std::mutex& mtx = ji->pDownloader->GetMutexProgress();
	std::lock_guard<std::mutex> lock(mtx);

	if (ji->lastPos < ji->originPos)
	{
		ji->lastPos = ji->originPos;
	}
	if (ji->startPos != ji->lastPos)
	{
		size_t nPos = ji->startPos - ji->lastPos;
		ji->lastPos = ji->startPos;

		ProgressData data(nPos, totalToDownload, ji->startPos, ji->stopPos, 0);
		ji->pDownloader->OnDownloadProgress(data);
	}

	return 0;
}
```

## 写数据
```cpp
size_t CCurlDownloader::writeData(void *ptr, size_t size, size_t nmemb, void *userdata)
{
	//多线程写同一个文件, 需要加锁
	CurlTaskInfo* ji = (CurlTaskInfo*)userdata;
	std::mutex& mtx = ji->pDownloader->GetMutexWrite();
	std::lock_guard<std::mutex> lock(mtx);

	// 取消下砸
	if (ji->pFileTaskInfo != nullptr && ji->pFileTaskInfo->CancelDownload())
	{
		return 0;
	}

	bool ranged = ji->ranged;
	size_t written = 0;
	//要分片下载的大文件, 需要设置http range域
	if (ranged) {
		if (ji->startPos + size * nmemb <= ji->stopPos) {
			_fseeki64(ji->fp, ji->startPos, SEEK_SET);
			written = fwrite(ptr, size, nmemb, ji->fp);
			fflush(ji->fp);
			ji->startPos += written;
		}
		else {
			_fseeki64(ji->fp, ji->startPos, SEEK_SET);
			written = fwrite(ptr, 1, ji->stopPos - ji->startPos + 1, ji->fp);
			fflush(ji->fp);
			ji->startPos += written;
		}
	}
	else {
		if (ji->startPos + size * nmemb <= ji->stopPos)
		{
			_fseeki64(ji->fp, ji->startPos, SEEK_SET);
			written = fwrite(ptr, size, nmemb, ji->fp);
			fflush(ji->fp);
			ji->startPos += written;
		}
		else
		{
			_fseeki64(ji->fp, ji->startPos, SEEK_SET);
			written = fwrite(ptr, 1, ji->stopPos - ji->startPos + 1, ji->fp);
			fflush(ji->fp);
			ji->startPos += written;
		}
	}
	return written;
}
```

## 文件大小
```cpp
size_t CCurlDownloader::getDownloadFileSize(const char* url)
{
	double lensize = 0.0;
	for (int iTry = 0; iTry < 2; iTry++)//由于curl_easy_perform可能会有偶发性的CURLE_WRITE_ERROR错误，所以添加重试机制
	{
		CURL *handle = curl_easy_init();
		curl_easy_setopt(handle, CURLOPT_URL, url);
		curl_easy_setopt(handle, CURLOPT_HEADER, 1);
		curl_easy_setopt(handle, CURLOPT_FOLLOWLOCATION, 1);
		curl_easy_setopt(handle, CURLOPT_NOBODY, 1);
		curl_easy_setopt(handle, CURLOPT_SSL_VERIFYHOST, 0L);
		curl_easy_setopt(handle, CURLOPT_SSL_VERIFYPEER, 0L);
		CURLcode res = curl_easy_perform(handle), resGetInfo = CURLE_OK;
		if (res == CURLE_OK) {
			resGetInfo = curl_easy_getinfo(handle, CURLINFO_CONTENT_LENGTH_DOWNLOAD, &lensize);
			if (CURLE_OK == resGetInfo)
			{
				curl_easy_cleanup(handle);
				return (size_t)lensize;
			}
		}
		curl_easy_cleanup(handle);
		Sleep(200); //为什么需要延迟
	}
	return 0;
}
```
## 内容长度
```cpp
size_t CCurlDownloader::getContentLengthFunc(void * ptr, size_t size, size_t nmemb, void * stream)
{
	LONGLONG len = 0;
	int r = sscanf((const char *)ptr, "Content-Length:%I64d\n", &len);
	if (r)
	{
		*((LONGLONG *)stream) = len;
	}
	return size * nmemb;
}
```

# threadpool
[线程池C++11实现](https://github.com/wenbozou/threadpool)