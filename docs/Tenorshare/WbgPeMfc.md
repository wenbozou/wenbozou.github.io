---
sidebar_label: 'WbgPeMfc'
sidebar_position: 6
---


# 简介
    WindowsBootGenius-PE-MFC 是一款基于Widows PE 系统的修复系统引导、重置系统系、解锁bitlock的系统软件。

# 读磁盘分区信息
```cpp title="读磁盘分区信息"
bool CDiskInfos::InitDiskPartitionInfos(unsigned int nDiskNum)
{
	EmDiskPartitionStyle type = EmDiskPartitionStyle::DT_Unknown;

	// 磁盘MBR或GPT 类型
	wchar_t szDriveName[MAX_PATH] = { 0 };
	_snwprintf(szDriveName, MAX_PATH, L"\\\\.\\PhysicalDrive%d", nDiskNum);
	HANDLE hDisk = NULL;
	hDisk = CreateFile(szDriveName, GENERIC_READ | GENERIC_WRITE, FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, 0, NULL);
	uint32_t byte_returned = 0;
	std::vector<uint8_t> disk_layout_buffer;
	int disk_layout_size = sizeof(DRIVE_LAYOUT_INFORMATION_EX) + sizeof(PARTITION_INFORMATION_EX) * 127;
	disk_layout_buffer.resize(disk_layout_size);
	DRIVE_LAYOUT_INFORMATION_EX *disk_layout = (DRIVE_LAYOUT_INFORMATION_EX *)disk_layout_buffer.data();
	try {
		if (!DeviceIoControl(hDisk, IOCTL_DISK_GET_DRIVE_LAYOUT_EX, NULL, 0, disk_layout, disk_layout_size, (LPDWORD)&byte_returned, NULL))
		{
			// 失败
			disk_layout->PartitionStyle = PARTITION_STYLE_RAW;
			return false;
		}
	}
	catch (exception ex) 
	{
		return false;
	}
	

	if (disk_layout->PartitionStyle == PARTITION_STYLE::PARTITION_STYLE_GPT)
	{
		ConfigDiskPartsByGPTLayout(disk_layout, nDiskNum);
	}
	else if (disk_layout->PartitionStyle == PARTITION_STYLE::PARTITION_STYLE_MBR && disk_layout->PartitionCount > 0)
	{
		ConfigDiskPartsByMBRLayout(disk_layout, nDiskNum);
	}

	CloseHandle(hDisk);
	return true;
}

void CDiskInfos::ConfigDiskPartsByGPTLayout(DRIVE_LAYOUT_INFORMATION_EX *disk_layout, unsigned int nDiskNum)
{
	DiskInfo di;
	di.iDiskNum = nDiskNum;

	uint64_t usable_start_offset = disk_layout->Gpt.StartingUsableOffset.QuadPart;
	uint64_t usable_end_offset = usable_start_offset + disk_layout->Gpt.UsableLength.QuadPart;

	bool is_dynamic_disk = false;
	bool is_end = false;
	unsigned long partition_count = disk_layout->PartitionCount;
	PARTITION_INFORMATION_EX *partition_entrys = disk_layout->PartitionEntry;

	for (int i = 0; !is_end && i < partition_count; ++i)
	{
		uint8_t guid[16];
		ChangeSeqGuid((uint8_t*)&partition_entrys[i].Gpt.PartitionType, guid);
		is_end = !IsPartitionTableGPTItem(guid);

		uint64_t disk_offset = (uint64_t)partition_entrys[i].StartingOffset.QuadPart;
		uint64_t total_size = (uint64_t)partition_entrys[i].PartitionLength.QuadPart;
		
		PARTITION_INFORMATION_EX curItem = partition_entrys[i];
		PartitionInfo pi;
		pi.info = curItem;
		pi.isActivate = false;
		pi.isEfi = false;

		std::string uuid;
		if (disk_offset > 0 && total_size > 0)
		{
			GUIDToString((uint8_t*)&partition_entrys[i].Gpt.PartitionId, uuid);

			int64_t attr = 0;
			if (partition_entrys[i].Gpt.Attributes == 0X1)	// OEM分区
			{
				//attr |= DPT_PARTITION_ATTR_OEM;
			}

			if (IsEqualBytesArray(guid, BASIC_DATA_PARTITION_GUID, 16)) {
			}
			else if (IsEqualBytesArray(guid, EFI_PARTITION_GUID, 16)) {
				pi.isEfi = true;
			}
			else if (IsEqualBytesArray(guid, MSR_PARTITION_GUID, 16)) {
			}
			else if (IsEqualBytesArray(guid, WRE_PARTITION_GUID, 16)) {
			}
			else if (IsEqualBytesArray(guid, LDM_META_PARTITION_GUID, 16)) {
				is_dynamic_disk = true;
			}
			else if (IsEqualBytesArray(guid, LDM_PARTITION_GUID, 16)) {
				is_dynamic_disk = true;
			}
			else if (IsEqualBytesArray(guid, APPLE_HFS_PARTITION_GUID, 16)) {
				is_dynamic_disk = false;
			}
			else if (IsEqualBytesArray(guid, APPLE_APFS_PARTITION_GUID, 16)) {
				is_dynamic_disk = false;
			}
			else {
			}
		}

		di.vecPartInfo.push_back(pi);
	}

	m_vecDiskInfos.push_back(di);
}

void CDiskInfos::ConfigDiskPartsByMBRLayout(DRIVE_LAYOUT_INFORMATION_EX *disk_layout, unsigned int nDiskNum)
{
	DiskInfo di;
	di.iDiskNum = nDiskNum;

	bool is_mbr = true;
	unsigned long partition_count = disk_layout->PartitionCount;
	PARTITION_INFORMATION_EX *partition_entrys = disk_layout->PartitionEntry;
	bool is_dynamic_disk = false;

	
	for (int i = 0; i < partition_count; ++i)
	{
		std::string uuid;
		GUIDToString((uint8_t*)&partition_entrys[i].Gpt.PartitionId, uuid);

		PARTITION_INFORMATION_EX curItem = partition_entrys[i];
		PartitionInfo pi;
		pi.info = curItem;
		pi.isActivate = false;
		pi.isEfi = false;

		// 是扩展分区
		uint64_t disk_offset = (uint64_t)partition_entrys[i].StartingOffset.QuadPart;

		if (i >= 4)
		{
			is_mbr = false;
		}

		if (partition_entrys[i].Mbr.PartitionType == PARTITION_EXTENDED 
			|| partition_entrys[i].Mbr.PartitionType == PARTITION_XINT13_EXTENDED)
		{
			continue;
		}
		else if (partition_entrys[i].Mbr.PartitionType != PARTITION_ENTRY_UNUSED)
		{
			if (partition_entrys[i].Mbr.PartitionType == PARTITION_LDM)
			{
				
				is_dynamic_disk = true;
			}
			else
			{
			}

			uint64_t total_size = (uint64_t)partition_entrys[i].PartitionLength.QuadPart;
			if (disk_offset > 0 && total_size > 0)
			{
				
				GUIDToString((uint8_t*)&partition_entrys[i].Mbr.PartitionId, uuid);
			}

			if (partition_entrys[i].Mbr.BootIndicator)
			{
				pi.isActivate = true;
			}
		}

		di.vecPartInfo.push_back(pi);

		GUIDToString((uint8_t*)&partition_entrys[i].Mbr.PartitionId, uuid);
		
	}

	m_vecDiskInfos.push_back(di);
}

void CDiskInfos::GUIDToString(const uint8_t *guid, std::string & guid_str)
{
	guid_str = "";

	char ch[3] = { 0 };
	for (int i = 3; i >= 0; --i)
	{
		sprintf(ch, "%02x", guid[i]);
		guid_str += ch;
	}
	guid_str += "-";
	for (int i = 5; i >= 4; --i)
	{
		sprintf(ch, "%02x", guid[i]);
		guid_str += ch;
	}
	guid_str += "-";
	for (int i = 7; i >= 6; --i)
	{
		sprintf(ch, "%02x", guid[i]);
		guid_str += ch;
	}
	guid_str += "-";
	for (int i = 8; i <= 9; ++i)
	{
		sprintf(ch, "%02x", guid[i]);
		guid_str += ch;
	}
	guid_str += "-";
	for (int i = 10; i < 16; ++i)
	{
		sprintf(ch, "%02x", guid[i]);
		guid_str += ch;
	}
}

void CDiskInfos::ChangeSeqGuid(uint8_t *guid, uint8_t *seq_guid)
{
	//最左边4位，是大端，转过来
	seq_guid[0] = guid[3]; seq_guid[1] = guid[2]; seq_guid[2] = guid[1]; seq_guid[3] = guid[0];
	//交叉顺序
	seq_guid[4] = guid[5]; seq_guid[5] = guid[4]; seq_guid[6] = guid[7]; seq_guid[7] = guid[6];
	//顺序
	for (int i = 8; i < 16; i++)
		seq_guid[i] = guid[i];
}

bool CDiskInfos::IsPartitionTableGPTItem(uint8_t *guid)
{
	uint8_t flag = 0;

	for (int i = 0; i < 16; i++)
	{
		flag = flag | guid[i];
	}

	return flag;
}
```


# 设置显示字体
```cpp title="加载字体资源"
void CFontsManager::FindFontFiles(CString strFontDir)
{
	CFileFind tempFind;
	CString strTmp;
	strFontDir += L"\\*.ttf";
	bool bFound = tempFind.FindFile(strFontDir);
	while (bFound)
	{
		bFound = tempFind.FindNextFile();
		if (tempFind.IsDots())
			continue;
		if (tempFind.IsDirectory())
		{
			strTmp = L"";
			strTmp = tempFind.GetFilePath();
			FindFontFiles(strTmp);
		}
		else
		{
			strTmp = tempFind.GetFilePath();
			int value = AddFontResourceEx(strTmp, FR_PRIVATE, NULL);
			g_pSingleMethod->AddLog(L"FindFontFiles, %s, return %d", strTmp.GetBuffer(), value);
			strTmp.ReleaseBuffer();
		}
	}
}
```

```cpp title="创建字体"
bool CFontsManager::CreateFontByName(CString strFontName, int nFontHeight, int nLineHeight, int nFontWeight,  CFont &font, LOGFONT *pLf)
{
	int nFontHeightTemp = 0;
	CString strFontNameTemp = L"";
	if (strFontName.Find(L"Poppins") != -1)
	{
		switch (nFontWeight)
		{
		case FW_LIGHT:
			strFontName = L"Poppins Light";
			break;
		case FW_NORMAL: //or FW_REGULAR
			//strFontName = L"Poppins Light";
			strFontName = L"Poppins";
			break;
		case FW_MEDIUM:
			//strFontName = L"Poppins Bold";
			strFontName = L"Poppins Medium";
			break;
		case FW_SEMIBOLD:
			strFontName = L"Poppins SemiBold";
			break;
		case FW_BOLD:
			strFontName = L"Poppins Bold";
			break;
		default:
			break;
		}
	}
	else
	{
		return false;
	}

	int nChartSet = GetCharSetForLanguage(g_pSingleMethod->GetCurLang());

	if (IsCanUsePoppinsFont())
	{
		nFontHeightTemp = nLineHeight;
		strFontNameTemp = strFontName;
	}
	else
	{
		nFontHeightTemp = nLineHeight;//nFontHeight;
		strFontNameTemp = L"Microsoft YaHei UI";
	}

	BOOL bRes = font.CreateFont(
		nFontHeightTemp,          // nHeightS
		0,                        // nWidth
		0,                        // nEscapement
		0,                        // nOrientation
		nFontWeight,              // nWeight
		FALSE,                    // bItalic
		FALSE,                    // bUnderline
		0,                        // cStrikeOut
		ANSI_CHARSET,			// nCharSet
		OUT_DEFAULT_PRECIS,       // nOutPrecision
		CLIP_DEFAULT_PRECIS,      // nClipPrecision
		DEFAULT_QUALITY,          // nQuality
		DEFAULT_PITCH | FF_SWISS, // nPitchAndFamily
		strFontNameTemp);
	if (pLf != NULL)
	{
		LOGFONT lf;
		::ZeroMemory(&lf, sizeof(lf));
		font.GetLogFont(&lf);
		memcpy((void*)pLf, (void*)&lf, sizeof(LOGFONT));
	}
	return true;
}
```

# 自定义平铺TileGrid控件
[参考链接Demo](https://www.codeproject.com/Articles/1099222/Tile-Grid-Control)

# 加载、卸载注册表文件
```cpp title="加载注册表文件"
BOOL CSingleMethod::LoadHive(CString strFilePath)
{
	HKEY hOpen;
	long Ret = RegOpenKeyEx(HKEY_LOCAL_MACHINE, NULL, KEY_CREATE_SUB_KEY | KEY_WRITE | KEY_ALL_ACCESS, 0, &hOpen);
	if (Ret != ERROR_SUCCESS)
		return FALSE;
	RemoveHive();
	Ret = RegLoadKey(hOpen, TEXT("LOAD_SOFTWARE"), strFilePath);
	RegCloseKey(hOpen);
	if (Ret != ERROR_SUCCESS)
		return FALSE;

	return TRUE;
}
```

```cpp title="卸载注册表文件"
BOOL CSingleMethod::RemoveHive()
{
	RegUnLoadKey(HKEY_LOCAL_MACHINE, TEXT("LOAD_SOFTWARE"));
	return TRUE;
}
```

# 从注册表中读取版本信息
```cpp title="读取版本信息"
CString CSingleMethod::GetWindowsName(CString str, CString& strExtraInfo)
{
	CString strSystemPath = str + TEXT("\\system32\\config\\software");

	LoadHive(strSystemPath);
	CRegKey regkey;
	LPTSTR lpszKeyName = TEXT("LOAD_SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion");
	LONG result = regkey.Open(HKEY_LOCAL_MACHINE, lpszKeyName, KEY_READ);
	if (ERROR_SUCCESS != result)
	{
		RemoveHive();
		return TEXT("Windows");
	}

	ULONG nCount = MAX_PATH;
	TCHAR szWindowVersion[MAX_PATH] = { 0 };
	if (ERROR_SUCCESS != regkey.QueryStringValue(TEXT("ProductName"), (TCHAR *)szWindowVersion, &nCount)) {
		regkey.Close();
		RemoveHive();
		return TEXT("Windows");
	}
	DWORD dwMajor = 0, dwMinor = 0;
	regkey.QueryDWORDValue(TEXT("CurrentMajorVersionNumber"), dwMajor);
	regkey.QueryDWORDValue(TEXT("CurrentMinorVersionNumber"), dwMinor);
	TCHAR szBuildNum[MAX_PATH] = { 0 };
	regkey.QueryStringValue(TEXT("CurrentBuildNumber"), (TCHAR *)szBuildNum, &nCount);
	TCHAR szBuildNum1[MAX_PATH] = { 0 };
	regkey.QueryStringValue(TEXT("CurrentBuild"), (TCHAR *)szBuildNum1, &nCount);
	TCHAR szReleaseId[MAX_PATH] = { 0 };
	regkey.QueryStringValue(TEXT("ReleaseId"), (TCHAR *)szReleaseId, &nCount);
	strExtraInfo.Format(_T("%d.%d.%s (%s)"), dwMajor, dwMinor, szBuildNum, szReleaseId);
	regkey.Close();
	RemoveHive();
	int iBuild = _tcstod(szBuildNum, NULL), iBuild1 = _tcstod(szBuildNum1, NULL);
	if ((iBuild >= 22000) || (iBuild1 >= 22000))
		return TEXT("Windows 11");
	return szWindowVersion;
}
```

# 多进程 & 命名管道通讯 & 事件同步
```cpp title="从cmd启动一个新进程, 以管道进行数据传输"
bool CRunCmdProcess::RunCmdAndOutPutRedirect(const std::wstring &cmd, bool wait, bool onlyShowCmd, CMsgRecipient* pMsgRecipient)
{
	///*
	SECURITY_ATTRIBUTES sa;
	memset(&sa, 0, sizeof(SECURITY_ATTRIBUTES));
	sa.nLength = sizeof(sa);
	sa.lpSecurityDescriptor = NULL;
	sa.bInheritHandle = TRUE;

	HANDLE hOutputRead = NULL, hOutputWrite = NULL;
	if (!CreatePipe(&hOutputRead, &hOutputWrite, &sa, 0))
	{
		return false;
	}

	if (pMsgRecipient)
	{
		pMsgRecipient->Subcription(hOutputRead, cmd);
	}

	STARTUPINFO si;
	PROCESS_INFORMATION pi;
	memset(&si, 0, sizeof(STARTUPINFO));
	memset(&pi, 0, sizeof(PROCESS_INFORMATION));
	si.cb = sizeof(STARTUPINFO);
	si.dwFlags |= STARTF_USESTDHANDLES;
	si.wShowWindow = SW_HIDE;
	si.hStdInput = NULL;
	si.hStdError = hOutputWrite;
	si.hStdOutput = hOutputWrite;

	BOOL bInheritHandles = TRUE;
	DWORD dwCreateFlags = CREATE_NO_WINDOW;
	if (onlyShowCmd)
	{
		bInheritHandles = false;
		dwCreateFlags = NORMAL_PRIORITY_CLASS | CREATE_NEW_CONSOLE | CREATE_NEW_PROCESS_GROUP;
	}
	if (!CreateProcess(NULL,
		(LPWSTR)cmd.c_str(),
		NULL,
		NULL,
		bInheritHandles,
		dwCreateFlags,
		NULL,
		NULL,
		&si,
		&pi))
	{
		CloseHandle(hOutputRead);
		CloseHandle(hOutputWrite);
		return false;
	}

	if (wait)
	{
		if (pMsgRecipient) pMsgRecipient->AddProcessFromCmd(pi.hProcess);

		DWORD dwRes = WaitForSingleObject(pi.hProcess, INFINITE);

		if (pMsgRecipient) pMsgRecipient->RemoveProcessFormCmd(pi.hProcess);
	}

	if (pMsgRecipient)
	{
		Sleep(1000 * 2);
		pMsgRecipient->Unsubcription();
	}

	CloseHandle(hOutputRead);
	CloseHandle(hOutputWrite);
	CloseHandle(pi.hThread);
	CloseHandle(pi.hProcess);
	return true;
}
```

```cpp title="CMsgRecipient.h"
class CMsgRecipient
{
public:
	CMsgRecipient();
	virtual ~CMsgRecipient();
	virtual void Subcription(HANDLE hFile, wstring strRequestCmd=L"");
	virtual void Unsubcription();
	virtual void ReadFiles();
	virtual void ParseMsg();

	void AddProcessFromCmd(HANDLE hProcess);
	void RemoveProcessFormCmd(HANDLE hProcess);
	void CancelWaitProcessEnd(bool isAll=true);
protected:
	char* CopyBuffer(char* pBuffer, size_t length);
	void DeleteCopiedBuffer(std::pair<char*, size_t> item);
	virtual void ParsedMsgText(const wchar_t* pContent);

protected:
	HANDLE m_hFileRedirect;	// 用于重定向的管道句柄
	bool m_bExist;			// 
	std::queue<std::pair<char*, size_t>> m_queCache;	// 缓存从管道读取的内容
	wstring m_strRequestCmd;		// 请求的指令参数字符串
	std::list<HANDLE> m_lstProcessHandle;	// 启动的进程句柄
	HANDLE			  m_hHandleTimeOutQuitProcess;	// 程序关闭，超时线程句柄

	HANDLE m_hThreadReceiveCmdResult;	// 线程句柄，读管道内容
	HANDLE m_hThreadParseCmdResult;		// 线程句柄，解析管道内容
	HANDLE m_hSyncEventParseCmdResult;  // 事件， 用于同步解析操作
};
```

```cpp title="CMsgRecipient.cpp"
CMsgRecipient::CMsgRecipient() 
	: m_hFileRedirect(nullptr)
	, m_bExist(false)
	, m_strRequestCmd(L"")
	, m_hHandleTimeOutQuitProcess(NULL)
	, m_hThreadReceiveCmdResult(NULL)
	, m_hThreadParseCmdResult(NULL)
{
	m_queCache.empty();

	m_hSyncEventParseCmdResult = CreateEvent(NULL, TRUE, FALSE, NULL);
}

CMsgRecipient::~CMsgRecipient()
{
	DELETE_THREAD_HANDLER(m_hThreadReceiveCmdResult);
	DELETE_THREAD_HANDLER(m_hThreadParseCmdResult);
	DELETE_THREAD_HANDLER(m_hSyncEventParseCmdResult);
}

void CMsgRecipient::Subcription(HANDLE hFile,wstring strRequestCmd)
{
	m_hFileRedirect = hFile; 
	m_strRequestCmd = strRequestCmd;
	m_bExist = false;
};

void CMsgRecipient::Unsubcription() 
{
	m_bExist = true;
	m_hFileRedirect = NULL;
	Sleep(100);	// 等 readFiles 循环退出
};

void CMsgRecipient::AddProcessFromCmd(HANDLE hProcess)
{
	m_lstProcessHandle.push_back(hProcess);
}

void CMsgRecipient::ReadFiles() {
	if (NULL == m_hFileRedirect)
	{
		return;
	}

	string outstr = "";
	char buffer[BUFSIZE] = { 0 };
	DWORD readBytes = 0;
	while (!m_bExist)
	{
		memset(buffer, 0, sizeof(char)*BUFSIZE);
		// 对管道数据进行读，但不会删除管道里的数据，若果没有数据，就立即返回
		if (!PeekNamedPipe(m_hFileRedirect, buffer, sizeof(char)*BUFSIZE, &readBytes, 0, NULL))
		{
			DWORD dw = GetLastError();
			break;
		}

		// 检查是否读到数据，如果没有数据，继续等待
		if (0 == readBytes)
		{
			Sleep(200);
			continue;
		}

		readBytes = 0;
		if (ReadFile(m_hFileRedirect, buffer, sizeof(char)*BUFSIZE, &readBytes, NULL))
		{
			if (CopyBuffer(buffer, readBytes) == nullptr) continue;

			SetEvent(m_hSyncEventParseCmdResult);
		}
	}

	//DELETE_THREAD_HANDLER(m_hThreadReceiveCmdResult);
};

void CMsgRecipient::ParseMsg() {

};

void CMsgRecipient::RemoveProcessFormCmd(HANDLE hProcess)
{
	m_lstProcessHandle.remove(hProcess);
}
void CMsgRecipient::CancelWaitProcessEnd(bool isAll)
{
	if (isAll)
	{
		while (m_lstProcessHandle.size())
		{
			// 主动终止进程
			TerminateProcess(m_lstProcessHandle.front(), 9999);
			m_lstProcessHandle.pop_front();
		}
	}
	else
	{
		if (m_hHandleTimeOutQuitProcess != NULL && m_lstProcessHandle.front() == m_hHandleTimeOutQuitProcess)
		{
			TerminateProcess(m_hHandleTimeOutQuitProcess, 9999);
			m_hHandleTimeOutQuitProcess = NULL;
		}
	}
}

char* CMsgRecipient::CopyBuffer(char* pBuffer, size_t length)
{
	if (nullptr == pBuffer || length < 1)
	{
		return nullptr;
	}

	char* p = new char[length+2];
	memset(p, 0, (length+2) * sizeof(char));
	memcpy(p, pBuffer, length);
	m_queCache.push(std::pair<char*, size_t>(p, length));
	return p; 
}

void CMsgRecipient::DeleteCopiedBuffer(std::pair<char*, size_t> item)
{
	if (item.first)
	{
		delete[] item.first;
		item.first = nullptr;
	}
}

void CMsgRecipient::ParsedMsgText(const wchar_t* pContent)
{
}
```


# 提权 & 权限提升
```cpp
void CSingleMethod::EnablePrivilege()
{
	HANDLE hToken = NULL;
	if (!OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken)) {
		return;
	}
	TOKEN_PRIVILEGES tkp;
	LookupPrivilegeValue(NULL, SE_RESTORE_NAME, &tkp.Privileges[0].Luid);
	tkp.PrivilegeCount = 1;
	tkp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
	AdjustTokenPrivileges(hToken, FALSE, &tkp, 0, NULL, 0);
	BOOL bEnabled = (GetLastError() == ERROR_SUCCESS);
	CloseHandle(hToken);
}
```

# 读取进程信息
```cpp title="命令行信息"
bool CProcessInfos::GetProcessCommandLine(DWORD dwProcessId, CString &strCommandLine)
{
	// open the process
	HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, dwProcessId);
	DWORD err = 0;
	if (hProcess == NULL)
	{
		err = GetLastError();
		return false;
	}

	// determine if 64 or 32-bit processor
	SYSTEM_INFO si;
	GetNativeSystemInfo(&si);

	// determine if this process is running on WOW64
	BOOL wow;
	IsWow64Process(GetCurrentProcess(), &wow);

	// use WinDbg "dt ntdll!_PEB" command and search for ProcessParameters offset to find the truth out
	DWORD ProcessParametersOffset = si.wProcessorArchitecture == PROCESSOR_ARCHITECTURE_AMD64 ? 0x20 : 0x10;
	DWORD CommandLineOffset = si.wProcessorArchitecture == PROCESSOR_ARCHITECTURE_AMD64 ? 0x70 : 0x40;

	// read basic info to get ProcessParameters address, we only need the beginning of PEB
	DWORD pebSize = ProcessParametersOffset + 8;
	PBYTE peb = (PBYTE)malloc(pebSize);
	ZeroMemory(peb, pebSize);

	// read basic info to get CommandLine address, we only need the beginning of ProcessParameters
	DWORD ppSize = CommandLineOffset + 16;
	PBYTE pp = (PBYTE)malloc(ppSize);
	ZeroMemory(pp, ppSize);

	PWSTR cmdLine = NULL;

	if (wow)
	{
		// we're running as a 32-bit process in a 64-bit OS
		PROCESS_BASIC_INFORMATION_WOW64 pbi;
		ZeroMemory(&pbi, sizeof(pbi));

		// get process information from 64-bit world
		_NtQueryInformationProcess query = (_NtQueryInformationProcess)GetProcAddress(GetModuleHandleA("ntdll.dll"), "NtWow64QueryInformationProcess64");
		err = query(hProcess, 0, &pbi, sizeof(pbi), NULL);
		if (err != 0)
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			return false;
		}

		// read PEB from 64-bit address space
		_NtWow64ReadVirtualMemory64 read = (_NtWow64ReadVirtualMemory64)GetProcAddress(GetModuleHandleA("ntdll.dll"), "NtWow64ReadVirtualMemory64");
		err = read(hProcess, pbi.PebBaseAddress, peb, pebSize, NULL);
		if (err != 0)
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			return false;
		}

		// read ProcessParameters from 64-bit address space
		// PBYTE* parameters = (PBYTE*)*(LPVOID*)(peb + ProcessParametersOffset); // address in remote process address space
		PVOID64 parameters = (PVOID64) * ((PVOID64*)(peb + ProcessParametersOffset)); // corrected 64-bit address, see comments
		err = read(hProcess, parameters, pp, ppSize, NULL);
		if (err != 0)
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			return false;
		}

		// read CommandLine
		UNICODE_STRING_WOW64* pCommandLine = (UNICODE_STRING_WOW64*)(pp + CommandLineOffset);
		cmdLine = (PWSTR)malloc(pCommandLine->MaximumLength);
		err = read(hProcess, pCommandLine->Buffer, cmdLine, pCommandLine->MaximumLength, NULL);
		if (err != 0)
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			if (NULL != cmdLine) free(cmdLine);
			return false;
		}
	}
	else
	{
		// we're running as a 32-bit process in a 32-bit OS, or as a 64-bit process in a 64-bit OS
		PROCESS_BASIC_INFORMATION pbi;
		ZeroMemory(&pbi, sizeof(pbi));

		// get process information
		_NtQueryInformationProcess query = (_NtQueryInformationProcess)GetProcAddress(GetModuleHandleA("ntdll.dll"), "NtQueryInformationProcess");
		err = query(hProcess, 0, &pbi, sizeof(pbi), NULL);
		if (err != 0)
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			return false;
		}

		// read PEB
		if (!ReadProcessMemory(hProcess, pbi.PebBaseAddress, peb, pebSize, NULL))
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			return false;
		}

		// read ProcessParameters
		PBYTE* parameters = (PBYTE*)*(LPVOID*)(peb + ProcessParametersOffset); // address in remote process adress space
		if (!ReadProcessMemory(hProcess, parameters, pp, ppSize, NULL))
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			return false;
		}

		// read CommandLine
		UNICODE_STRING* pCommandLine = (UNICODE_STRING*)(pp + CommandLineOffset);
		cmdLine = (PWSTR)malloc(pCommandLine->MaximumLength);
		if (!ReadProcessMemory(hProcess, pCommandLine->Buffer, cmdLine, pCommandLine->MaximumLength, NULL))
		{
			CloseHandle(hProcess);
			free(peb);
			free(pp);
			if (NULL != cmdLine) free(cmdLine);
			return false;
		}
		strCommandLine = cmdLine;
		free(peb);
		free(pp);
		if (NULL != cmdLine) free(cmdLine);
	}
	CloseHandle(hProcess);
	return true;
}
```

```cpp title="置顶"
bool CProcessInfos::ProcessWndTopMost(CString strProcessName)
{
	bool bRes = false;

	DWORD aProcesses[1024], cbNeeded, cProcesses;
	unsigned int i;
	if (!EnumProcesses(aProcesses, sizeof(aProcesses), &cbNeeded))
	{
		return false;
	}

	cProcesses = cbNeeded / sizeof(DWORD);
	for (i = 0; i < cProcesses; i++)
	{
		if (aProcesses[i] != 0)
		{
			CString strTempName;
			if (GetProcessCommandLine(aProcesses[i], strTempName))
			{
				if (strTempName.Find(strProcessName) != -1)
				{
					RtlZeroMemory(&s_topMostWndInfo, sizeof(TOP_MOST_WND_INFO));
					s_topMostWndInfo.dwProcessId = aProcesses[i];
					wcscpy(s_topMostWndInfo.szMainWndTitle, strProcessName.GetBuffer());
					strProcessName.ReleaseBuffer();
					EnumWindows((WNDENUMPROC)EnumWindowsProc, s_topMostWndInfo.dwProcessId);
					ShowWindow(s_topMostWndInfo.hWnd, SW_MINIMIZE);
					ShowWindow(s_topMostWndInfo.hWnd, SW_NORMAL);
					break;
				}
			}
		}
	}
	return bRes;
}

TOP_MOST_WND_INFO CProcessInfos::s_topMostWndInfo = {0};
bool CProcessInfos::EnumWindowsProc(HWND hwnd, DWORD lParam)
{
	int i = GetWindowTextLength(hwnd);
	TCHAR szhello[255] = { 0 };
	GetWindowText(hwnd, szhello, i + 1);
	if (wcscmp(szhello, s_topMostWndInfo.szMainWndTitle) == 0)
	{
		s_topMostWndInfo.hWnd = hwnd;
		return FALSE;
	}
	return TRUE;
}
```