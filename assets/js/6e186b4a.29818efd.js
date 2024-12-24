"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[6830],{5060:(t,n,e)=>{e.r(n),e.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>c,frontMatter:()=>r,metadata:()=>a,toc:()=>l});var i=e(4848),s=e(8453);const r={sidebar_label:"WbgPeMfc",sidebar_position:6},o="\u7b80\u4ecb",a={id:"Tenorshare/WbgPeMfc",title:"\u7b80\u4ecb",description:"WindowsBootGenius-PE-MFC \u662f\u4e00\u6b3e\u57fa\u4e8eWidows PE \u7cfb\u7edf\u7684\u4fee\u590d\u7cfb\u7edf\u5f15\u5bfc\u3001\u91cd\u7f6e\u7cfb\u7edf\u7cfb\u3001\u89e3\u9501bitlock\u7684\u7cfb\u7edf\u8f6f\u4ef6\u3002",source:"@site/docs/Tenorshare/WbgPeMfc.md",sourceDirName:"Tenorshare",slug:"/Tenorshare/WbgPeMfc",permalink:"/docs/Tenorshare/WbgPeMfc",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Tenorshare/WbgPeMfc.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_label:"WbgPeMfc",sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"SignPropertyHandler",permalink:"/docs/Tenorshare/SignPropertyHandler"},next:{title:"\u8bbe\u8ba1\u6a21\u5f0f",permalink:"/docs/category/\u8bbe\u8ba1\u6a21\u5f0f"}},d={},l=[];function u(t){const n={a:"a",code:"code",h1:"h1",header:"header",p:"p",pre:"pre",...(0,s.R)(),...t.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"\u7b80\u4ecb",children:"\u7b80\u4ecb"})}),"\n",(0,i.jsx)(n.p,{children:"WindowsBootGenius-PE-MFC \u662f\u4e00\u6b3e\u57fa\u4e8eWidows PE \u7cfb\u7edf\u7684\u4fee\u590d\u7cfb\u7edf\u5f15\u5bfc\u3001\u91cd\u7f6e\u7cfb\u7edf\u7cfb\u3001\u89e3\u9501bitlock\u7684\u7cfb\u7edf\u8f6f\u4ef6\u3002"}),"\n",(0,i.jsx)(n.h1,{id:"\u8bfb\u78c1\u76d8\u5206\u533a\u4fe1\u606f",children:"\u8bfb\u78c1\u76d8\u5206\u533a\u4fe1\u606f"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u8bfb\u78c1\u76d8\u5206\u533a\u4fe1\u606f"',children:'bool CDiskInfos::InitDiskPartitionInfos(unsigned int nDiskNum)\n{\n\tEmDiskPartitionStyle type = EmDiskPartitionStyle::DT_Unknown;\n\n\t// \u78c1\u76d8MBR\u6216GPT \u7c7b\u578b\n\twchar_t szDriveName[MAX_PATH] = { 0 };\n\t_snwprintf(szDriveName, MAX_PATH, L"\\\\\\\\.\\\\PhysicalDrive%d", nDiskNum);\n\tHANDLE hDisk = NULL;\n\thDisk = CreateFile(szDriveName, GENERIC_READ | GENERIC_WRITE, FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, 0, NULL);\n\tuint32_t byte_returned = 0;\n\tstd::vector<uint8_t> disk_layout_buffer;\n\tint disk_layout_size = sizeof(DRIVE_LAYOUT_INFORMATION_EX) + sizeof(PARTITION_INFORMATION_EX) * 127;\n\tdisk_layout_buffer.resize(disk_layout_size);\n\tDRIVE_LAYOUT_INFORMATION_EX *disk_layout = (DRIVE_LAYOUT_INFORMATION_EX *)disk_layout_buffer.data();\n\ttry {\n\t\tif (!DeviceIoControl(hDisk, IOCTL_DISK_GET_DRIVE_LAYOUT_EX, NULL, 0, disk_layout, disk_layout_size, (LPDWORD)&byte_returned, NULL))\n\t\t{\n\t\t\t// \u5931\u8d25\n\t\t\tdisk_layout->PartitionStyle = PARTITION_STYLE_RAW;\n\t\t\treturn false;\n\t\t}\n\t}\n\tcatch (exception ex) \n\t{\n\t\treturn false;\n\t}\n\t\n\n\tif (disk_layout->PartitionStyle == PARTITION_STYLE::PARTITION_STYLE_GPT)\n\t{\n\t\tConfigDiskPartsByGPTLayout(disk_layout, nDiskNum);\n\t}\n\telse if (disk_layout->PartitionStyle == PARTITION_STYLE::PARTITION_STYLE_MBR && disk_layout->PartitionCount > 0)\n\t{\n\t\tConfigDiskPartsByMBRLayout(disk_layout, nDiskNum);\n\t}\n\n\tCloseHandle(hDisk);\n\treturn true;\n}\n\nvoid CDiskInfos::ConfigDiskPartsByGPTLayout(DRIVE_LAYOUT_INFORMATION_EX *disk_layout, unsigned int nDiskNum)\n{\n\tDiskInfo di;\n\tdi.iDiskNum = nDiskNum;\n\n\tuint64_t usable_start_offset = disk_layout->Gpt.StartingUsableOffset.QuadPart;\n\tuint64_t usable_end_offset = usable_start_offset + disk_layout->Gpt.UsableLength.QuadPart;\n\n\tbool is_dynamic_disk = false;\n\tbool is_end = false;\n\tunsigned long partition_count = disk_layout->PartitionCount;\n\tPARTITION_INFORMATION_EX *partition_entrys = disk_layout->PartitionEntry;\n\n\tfor (int i = 0; !is_end && i < partition_count; ++i)\n\t{\n\t\tuint8_t guid[16];\n\t\tChangeSeqGuid((uint8_t*)&partition_entrys[i].Gpt.PartitionType, guid);\n\t\tis_end = !IsPartitionTableGPTItem(guid);\n\n\t\tuint64_t disk_offset = (uint64_t)partition_entrys[i].StartingOffset.QuadPart;\n\t\tuint64_t total_size = (uint64_t)partition_entrys[i].PartitionLength.QuadPart;\n\t\t\n\t\tPARTITION_INFORMATION_EX curItem = partition_entrys[i];\n\t\tPartitionInfo pi;\n\t\tpi.info = curItem;\n\t\tpi.isActivate = false;\n\t\tpi.isEfi = false;\n\n\t\tstd::string uuid;\n\t\tif (disk_offset > 0 && total_size > 0)\n\t\t{\n\t\t\tGUIDToString((uint8_t*)&partition_entrys[i].Gpt.PartitionId, uuid);\n\n\t\t\tint64_t attr = 0;\n\t\t\tif (partition_entrys[i].Gpt.Attributes == 0X1)\t// OEM\u5206\u533a\n\t\t\t{\n\t\t\t\t//attr |= DPT_PARTITION_ATTR_OEM;\n\t\t\t}\n\n\t\t\tif (IsEqualBytesArray(guid, BASIC_DATA_PARTITION_GUID, 16)) {\n\t\t\t}\n\t\t\telse if (IsEqualBytesArray(guid, EFI_PARTITION_GUID, 16)) {\n\t\t\t\tpi.isEfi = true;\n\t\t\t}\n\t\t\telse if (IsEqualBytesArray(guid, MSR_PARTITION_GUID, 16)) {\n\t\t\t}\n\t\t\telse if (IsEqualBytesArray(guid, WRE_PARTITION_GUID, 16)) {\n\t\t\t}\n\t\t\telse if (IsEqualBytesArray(guid, LDM_META_PARTITION_GUID, 16)) {\n\t\t\t\tis_dynamic_disk = true;\n\t\t\t}\n\t\t\telse if (IsEqualBytesArray(guid, LDM_PARTITION_GUID, 16)) {\n\t\t\t\tis_dynamic_disk = true;\n\t\t\t}\n\t\t\telse if (IsEqualBytesArray(guid, APPLE_HFS_PARTITION_GUID, 16)) {\n\t\t\t\tis_dynamic_disk = false;\n\t\t\t}\n\t\t\telse if (IsEqualBytesArray(guid, APPLE_APFS_PARTITION_GUID, 16)) {\n\t\t\t\tis_dynamic_disk = false;\n\t\t\t}\n\t\t\telse {\n\t\t\t}\n\t\t}\n\n\t\tdi.vecPartInfo.push_back(pi);\n\t}\n\n\tm_vecDiskInfos.push_back(di);\n}\n\nvoid CDiskInfos::ConfigDiskPartsByMBRLayout(DRIVE_LAYOUT_INFORMATION_EX *disk_layout, unsigned int nDiskNum)\n{\n\tDiskInfo di;\n\tdi.iDiskNum = nDiskNum;\n\n\tbool is_mbr = true;\n\tunsigned long partition_count = disk_layout->PartitionCount;\n\tPARTITION_INFORMATION_EX *partition_entrys = disk_layout->PartitionEntry;\n\tbool is_dynamic_disk = false;\n\n\t\n\tfor (int i = 0; i < partition_count; ++i)\n\t{\n\t\tstd::string uuid;\n\t\tGUIDToString((uint8_t*)&partition_entrys[i].Gpt.PartitionId, uuid);\n\n\t\tPARTITION_INFORMATION_EX curItem = partition_entrys[i];\n\t\tPartitionInfo pi;\n\t\tpi.info = curItem;\n\t\tpi.isActivate = false;\n\t\tpi.isEfi = false;\n\n\t\t// \u662f\u6269\u5c55\u5206\u533a\n\t\tuint64_t disk_offset = (uint64_t)partition_entrys[i].StartingOffset.QuadPart;\n\n\t\tif (i >= 4)\n\t\t{\n\t\t\tis_mbr = false;\n\t\t}\n\n\t\tif (partition_entrys[i].Mbr.PartitionType == PARTITION_EXTENDED \n\t\t\t|| partition_entrys[i].Mbr.PartitionType == PARTITION_XINT13_EXTENDED)\n\t\t{\n\t\t\tcontinue;\n\t\t}\n\t\telse if (partition_entrys[i].Mbr.PartitionType != PARTITION_ENTRY_UNUSED)\n\t\t{\n\t\t\tif (partition_entrys[i].Mbr.PartitionType == PARTITION_LDM)\n\t\t\t{\n\t\t\t\t\n\t\t\t\tis_dynamic_disk = true;\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t}\n\n\t\t\tuint64_t total_size = (uint64_t)partition_entrys[i].PartitionLength.QuadPart;\n\t\t\tif (disk_offset > 0 && total_size > 0)\n\t\t\t{\n\t\t\t\t\n\t\t\t\tGUIDToString((uint8_t*)&partition_entrys[i].Mbr.PartitionId, uuid);\n\t\t\t}\n\n\t\t\tif (partition_entrys[i].Mbr.BootIndicator)\n\t\t\t{\n\t\t\t\tpi.isActivate = true;\n\t\t\t}\n\t\t}\n\n\t\tdi.vecPartInfo.push_back(pi);\n\n\t\tGUIDToString((uint8_t*)&partition_entrys[i].Mbr.PartitionId, uuid);\n\t\t\n\t}\n\n\tm_vecDiskInfos.push_back(di);\n}\n\nvoid CDiskInfos::GUIDToString(const uint8_t *guid, std::string & guid_str)\n{\n\tguid_str = "";\n\n\tchar ch[3] = { 0 };\n\tfor (int i = 3; i >= 0; --i)\n\t{\n\t\tsprintf(ch, "%02x", guid[i]);\n\t\tguid_str += ch;\n\t}\n\tguid_str += "-";\n\tfor (int i = 5; i >= 4; --i)\n\t{\n\t\tsprintf(ch, "%02x", guid[i]);\n\t\tguid_str += ch;\n\t}\n\tguid_str += "-";\n\tfor (int i = 7; i >= 6; --i)\n\t{\n\t\tsprintf(ch, "%02x", guid[i]);\n\t\tguid_str += ch;\n\t}\n\tguid_str += "-";\n\tfor (int i = 8; i <= 9; ++i)\n\t{\n\t\tsprintf(ch, "%02x", guid[i]);\n\t\tguid_str += ch;\n\t}\n\tguid_str += "-";\n\tfor (int i = 10; i < 16; ++i)\n\t{\n\t\tsprintf(ch, "%02x", guid[i]);\n\t\tguid_str += ch;\n\t}\n}\n\nvoid CDiskInfos::ChangeSeqGuid(uint8_t *guid, uint8_t *seq_guid)\n{\n\t//\u6700\u5de6\u8fb94\u4f4d\uff0c\u662f\u5927\u7aef\uff0c\u8f6c\u8fc7\u6765\n\tseq_guid[0] = guid[3]; seq_guid[1] = guid[2]; seq_guid[2] = guid[1]; seq_guid[3] = guid[0];\n\t//\u4ea4\u53c9\u987a\u5e8f\n\tseq_guid[4] = guid[5]; seq_guid[5] = guid[4]; seq_guid[6] = guid[7]; seq_guid[7] = guid[6];\n\t//\u987a\u5e8f\n\tfor (int i = 8; i < 16; i++)\n\t\tseq_guid[i] = guid[i];\n}\n\nbool CDiskInfos::IsPartitionTableGPTItem(uint8_t *guid)\n{\n\tuint8_t flag = 0;\n\n\tfor (int i = 0; i < 16; i++)\n\t{\n\t\tflag = flag | guid[i];\n\t}\n\n\treturn flag;\n}\n'})}),"\n",(0,i.jsx)(n.h1,{id:"\u8bbe\u7f6e\u663e\u793a\u5b57\u4f53",children:"\u8bbe\u7f6e\u663e\u793a\u5b57\u4f53"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u52a0\u8f7d\u5b57\u4f53\u8d44\u6e90"',children:'void CFontsManager::FindFontFiles(CString strFontDir)\n{\n\tCFileFind tempFind;\n\tCString strTmp;\n\tstrFontDir += L"\\\\*.ttf";\n\tbool bFound = tempFind.FindFile(strFontDir);\n\twhile (bFound)\n\t{\n\t\tbFound = tempFind.FindNextFile();\n\t\tif (tempFind.IsDots())\n\t\t\tcontinue;\n\t\tif (tempFind.IsDirectory())\n\t\t{\n\t\t\tstrTmp = L"";\n\t\t\tstrTmp = tempFind.GetFilePath();\n\t\t\tFindFontFiles(strTmp);\n\t\t}\n\t\telse\n\t\t{\n\t\t\tstrTmp = tempFind.GetFilePath();\n\t\t\tint value = AddFontResourceEx(strTmp, FR_PRIVATE, NULL);\n\t\t\tg_pSingleMethod->AddLog(L"FindFontFiles, %s, return %d", strTmp.GetBuffer(), value);\n\t\t\tstrTmp.ReleaseBuffer();\n\t\t}\n\t}\n}\n'})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u521b\u5efa\u5b57\u4f53"',children:'bool CFontsManager::CreateFontByName(CString strFontName, int nFontHeight, int nLineHeight, int nFontWeight,  CFont &font, LOGFONT *pLf)\n{\n\tint nFontHeightTemp = 0;\n\tCString strFontNameTemp = L"";\n\tif (strFontName.Find(L"Poppins") != -1)\n\t{\n\t\tswitch (nFontWeight)\n\t\t{\n\t\tcase FW_LIGHT:\n\t\t\tstrFontName = L"Poppins Light";\n\t\t\tbreak;\n\t\tcase FW_NORMAL: //or FW_REGULAR\n\t\t\t//strFontName = L"Poppins Light";\n\t\t\tstrFontName = L"Poppins";\n\t\t\tbreak;\n\t\tcase FW_MEDIUM:\n\t\t\t//strFontName = L"Poppins Bold";\n\t\t\tstrFontName = L"Poppins Medium";\n\t\t\tbreak;\n\t\tcase FW_SEMIBOLD:\n\t\t\tstrFontName = L"Poppins SemiBold";\n\t\t\tbreak;\n\t\tcase FW_BOLD:\n\t\t\tstrFontName = L"Poppins Bold";\n\t\t\tbreak;\n\t\tdefault:\n\t\t\tbreak;\n\t\t}\n\t}\n\telse\n\t{\n\t\treturn false;\n\t}\n\n\tint nChartSet = GetCharSetForLanguage(g_pSingleMethod->GetCurLang());\n\n\tif (IsCanUsePoppinsFont())\n\t{\n\t\tnFontHeightTemp = nLineHeight;\n\t\tstrFontNameTemp = strFontName;\n\t}\n\telse\n\t{\n\t\tnFontHeightTemp = nLineHeight;//nFontHeight;\n\t\tstrFontNameTemp = L"Microsoft YaHei UI";\n\t}\n\n\tBOOL bRes = font.CreateFont(\n\t\tnFontHeightTemp,          // nHeightS\n\t\t0,                        // nWidth\n\t\t0,                        // nEscapement\n\t\t0,                        // nOrientation\n\t\tnFontWeight,              // nWeight\n\t\tFALSE,                    // bItalic\n\t\tFALSE,                    // bUnderline\n\t\t0,                        // cStrikeOut\n\t\tANSI_CHARSET,\t\t\t// nCharSet\n\t\tOUT_DEFAULT_PRECIS,       // nOutPrecision\n\t\tCLIP_DEFAULT_PRECIS,      // nClipPrecision\n\t\tDEFAULT_QUALITY,          // nQuality\n\t\tDEFAULT_PITCH | FF_SWISS, // nPitchAndFamily\n\t\tstrFontNameTemp);\n\tif (pLf != NULL)\n\t{\n\t\tLOGFONT lf;\n\t\t::ZeroMemory(&lf, sizeof(lf));\n\t\tfont.GetLogFont(&lf);\n\t\tmemcpy((void*)pLf, (void*)&lf, sizeof(LOGFONT));\n\t}\n\treturn true;\n}\n'})}),"\n",(0,i.jsx)(n.h1,{id:"\u81ea\u5b9a\u4e49\u5e73\u94fatilegrid\u63a7\u4ef6",children:"\u81ea\u5b9a\u4e49\u5e73\u94faTileGrid\u63a7\u4ef6"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://www.codeproject.com/Articles/1099222/Tile-Grid-Control",children:"\u53c2\u8003\u94fe\u63a5Demo"})}),"\n",(0,i.jsx)(n.h1,{id:"\u52a0\u8f7d\u5378\u8f7d\u6ce8\u518c\u8868\u6587\u4ef6",children:"\u52a0\u8f7d\u3001\u5378\u8f7d\u6ce8\u518c\u8868\u6587\u4ef6"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u52a0\u8f7d\u6ce8\u518c\u8868\u6587\u4ef6"',children:'BOOL CSingleMethod::LoadHive(CString strFilePath)\n{\n\tHKEY hOpen;\n\tlong Ret = RegOpenKeyEx(HKEY_LOCAL_MACHINE, NULL, KEY_CREATE_SUB_KEY | KEY_WRITE | KEY_ALL_ACCESS, 0, &hOpen);\n\tif (Ret != ERROR_SUCCESS)\n\t\treturn FALSE;\n\tRemoveHive();\n\tRet = RegLoadKey(hOpen, TEXT("LOAD_SOFTWARE"), strFilePath);\n\tRegCloseKey(hOpen);\n\tif (Ret != ERROR_SUCCESS)\n\t\treturn FALSE;\n\n\treturn TRUE;\n}\n'})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u5378\u8f7d\u6ce8\u518c\u8868\u6587\u4ef6"',children:'BOOL CSingleMethod::RemoveHive()\n{\n\tRegUnLoadKey(HKEY_LOCAL_MACHINE, TEXT("LOAD_SOFTWARE"));\n\treturn TRUE;\n}\n'})}),"\n",(0,i.jsx)(n.h1,{id:"\u4ece\u6ce8\u518c\u8868\u4e2d\u8bfb\u53d6\u7248\u672c\u4fe1\u606f",children:"\u4ece\u6ce8\u518c\u8868\u4e2d\u8bfb\u53d6\u7248\u672c\u4fe1\u606f"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u8bfb\u53d6\u7248\u672c\u4fe1\u606f"',children:'CString CSingleMethod::GetWindowsName(CString str, CString& strExtraInfo)\n{\n\tCString strSystemPath = str + TEXT("\\\\system32\\\\config\\\\software");\n\n\tLoadHive(strSystemPath);\n\tCRegKey regkey;\n\tLPTSTR lpszKeyName = TEXT("LOAD_SOFTWARE\\\\Microsoft\\\\Windows NT\\\\CurrentVersion");\n\tLONG result = regkey.Open(HKEY_LOCAL_MACHINE, lpszKeyName, KEY_READ);\n\tif (ERROR_SUCCESS != result)\n\t{\n\t\tRemoveHive();\n\t\treturn TEXT("Windows");\n\t}\n\n\tULONG nCount = MAX_PATH;\n\tTCHAR szWindowVersion[MAX_PATH] = { 0 };\n\tif (ERROR_SUCCESS != regkey.QueryStringValue(TEXT("ProductName"), (TCHAR *)szWindowVersion, &nCount)) {\n\t\tregkey.Close();\n\t\tRemoveHive();\n\t\treturn TEXT("Windows");\n\t}\n\tDWORD dwMajor = 0, dwMinor = 0;\n\tregkey.QueryDWORDValue(TEXT("CurrentMajorVersionNumber"), dwMajor);\n\tregkey.QueryDWORDValue(TEXT("CurrentMinorVersionNumber"), dwMinor);\n\tTCHAR szBuildNum[MAX_PATH] = { 0 };\n\tregkey.QueryStringValue(TEXT("CurrentBuildNumber"), (TCHAR *)szBuildNum, &nCount);\n\tTCHAR szBuildNum1[MAX_PATH] = { 0 };\n\tregkey.QueryStringValue(TEXT("CurrentBuild"), (TCHAR *)szBuildNum1, &nCount);\n\tTCHAR szReleaseId[MAX_PATH] = { 0 };\n\tregkey.QueryStringValue(TEXT("ReleaseId"), (TCHAR *)szReleaseId, &nCount);\n\tstrExtraInfo.Format(_T("%d.%d.%s (%s)"), dwMajor, dwMinor, szBuildNum, szReleaseId);\n\tregkey.Close();\n\tRemoveHive();\n\tint iBuild = _tcstod(szBuildNum, NULL), iBuild1 = _tcstod(szBuildNum1, NULL);\n\tif ((iBuild >= 22000) || (iBuild1 >= 22000))\n\t\treturn TEXT("Windows 11");\n\treturn szWindowVersion;\n}\n'})}),"\n",(0,i.jsx)(n.h1,{id:"\u591a\u8fdb\u7a0b--\u547d\u540d\u7ba1\u9053\u901a\u8baf--\u4e8b\u4ef6\u540c\u6b65",children:"\u591a\u8fdb\u7a0b & \u547d\u540d\u7ba1\u9053\u901a\u8baf & \u4e8b\u4ef6\u540c\u6b65"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u4ececmd\u542f\u52a8\u4e00\u4e2a\u65b0\u8fdb\u7a0b, \u4ee5\u7ba1\u9053\u8fdb\u884c\u6570\u636e\u4f20\u8f93"',children:"bool CRunCmdProcess::RunCmdAndOutPutRedirect(const std::wstring &cmd, bool wait, bool onlyShowCmd, CMsgRecipient* pMsgRecipient)\n{\n\t///*\n\tSECURITY_ATTRIBUTES sa;\n\tmemset(&sa, 0, sizeof(SECURITY_ATTRIBUTES));\n\tsa.nLength = sizeof(sa);\n\tsa.lpSecurityDescriptor = NULL;\n\tsa.bInheritHandle = TRUE;\n\n\tHANDLE hOutputRead = NULL, hOutputWrite = NULL;\n\tif (!CreatePipe(&hOutputRead, &hOutputWrite, &sa, 0))\n\t{\n\t\treturn false;\n\t}\n\n\tif (pMsgRecipient)\n\t{\n\t\tpMsgRecipient->Subcription(hOutputRead, cmd);\n\t}\n\n\tSTARTUPINFO si;\n\tPROCESS_INFORMATION pi;\n\tmemset(&si, 0, sizeof(STARTUPINFO));\n\tmemset(&pi, 0, sizeof(PROCESS_INFORMATION));\n\tsi.cb = sizeof(STARTUPINFO);\n\tsi.dwFlags |= STARTF_USESTDHANDLES;\n\tsi.wShowWindow = SW_HIDE;\n\tsi.hStdInput = NULL;\n\tsi.hStdError = hOutputWrite;\n\tsi.hStdOutput = hOutputWrite;\n\n\tBOOL bInheritHandles = TRUE;\n\tDWORD dwCreateFlags = CREATE_NO_WINDOW;\n\tif (onlyShowCmd)\n\t{\n\t\tbInheritHandles = false;\n\t\tdwCreateFlags = NORMAL_PRIORITY_CLASS | CREATE_NEW_CONSOLE | CREATE_NEW_PROCESS_GROUP;\n\t}\n\tif (!CreateProcess(NULL,\n\t\t(LPWSTR)cmd.c_str(),\n\t\tNULL,\n\t\tNULL,\n\t\tbInheritHandles,\n\t\tdwCreateFlags,\n\t\tNULL,\n\t\tNULL,\n\t\t&si,\n\t\t&pi))\n\t{\n\t\tCloseHandle(hOutputRead);\n\t\tCloseHandle(hOutputWrite);\n\t\treturn false;\n\t}\n\n\tif (wait)\n\t{\n\t\tif (pMsgRecipient) pMsgRecipient->AddProcessFromCmd(pi.hProcess);\n\n\t\tDWORD dwRes = WaitForSingleObject(pi.hProcess, INFINITE);\n\n\t\tif (pMsgRecipient) pMsgRecipient->RemoveProcessFormCmd(pi.hProcess);\n\t}\n\n\tif (pMsgRecipient)\n\t{\n\t\tSleep(1000 * 2);\n\t\tpMsgRecipient->Unsubcription();\n\t}\n\n\tCloseHandle(hOutputRead);\n\tCloseHandle(hOutputWrite);\n\tCloseHandle(pi.hThread);\n\tCloseHandle(pi.hProcess);\n\treturn true;\n}\n"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="CMsgRecipient.h"',children:'class CMsgRecipient\n{\npublic:\n\tCMsgRecipient();\n\tvirtual ~CMsgRecipient();\n\tvirtual void Subcription(HANDLE hFile, wstring strRequestCmd=L"");\n\tvirtual void Unsubcription();\n\tvirtual void ReadFiles();\n\tvirtual void ParseMsg();\n\n\tvoid AddProcessFromCmd(HANDLE hProcess);\n\tvoid RemoveProcessFormCmd(HANDLE hProcess);\n\tvoid CancelWaitProcessEnd(bool isAll=true);\nprotected:\n\tchar* CopyBuffer(char* pBuffer, size_t length);\n\tvoid DeleteCopiedBuffer(std::pair<char*, size_t> item);\n\tvirtual void ParsedMsgText(const wchar_t* pContent);\n\nprotected:\n\tHANDLE m_hFileRedirect;\t// \u7528\u4e8e\u91cd\u5b9a\u5411\u7684\u7ba1\u9053\u53e5\u67c4\n\tbool m_bExist;\t\t\t// \n\tstd::queue<std::pair<char*, size_t>> m_queCache;\t// \u7f13\u5b58\u4ece\u7ba1\u9053\u8bfb\u53d6\u7684\u5185\u5bb9\n\twstring m_strRequestCmd;\t\t// \u8bf7\u6c42\u7684\u6307\u4ee4\u53c2\u6570\u5b57\u7b26\u4e32\n\tstd::list<HANDLE> m_lstProcessHandle;\t// \u542f\u52a8\u7684\u8fdb\u7a0b\u53e5\u67c4\n\tHANDLE\t\t\t  m_hHandleTimeOutQuitProcess;\t// \u7a0b\u5e8f\u5173\u95ed\uff0c\u8d85\u65f6\u7ebf\u7a0b\u53e5\u67c4\n\n\tHANDLE m_hThreadReceiveCmdResult;\t// \u7ebf\u7a0b\u53e5\u67c4\uff0c\u8bfb\u7ba1\u9053\u5185\u5bb9\n\tHANDLE m_hThreadParseCmdResult;\t\t// \u7ebf\u7a0b\u53e5\u67c4\uff0c\u89e3\u6790\u7ba1\u9053\u5185\u5bb9\n\tHANDLE m_hSyncEventParseCmdResult;  // \u4e8b\u4ef6\uff0c \u7528\u4e8e\u540c\u6b65\u89e3\u6790\u64cd\u4f5c\n};\n'})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="CMsgRecipient.cpp"',children:'CMsgRecipient::CMsgRecipient() \n\t: m_hFileRedirect(nullptr)\n\t, m_bExist(false)\n\t, m_strRequestCmd(L"")\n\t, m_hHandleTimeOutQuitProcess(NULL)\n\t, m_hThreadReceiveCmdResult(NULL)\n\t, m_hThreadParseCmdResult(NULL)\n{\n\tm_queCache.empty();\n\n\tm_hSyncEventParseCmdResult = CreateEvent(NULL, TRUE, FALSE, NULL);\n}\n\nCMsgRecipient::~CMsgRecipient()\n{\n\tDELETE_THREAD_HANDLER(m_hThreadReceiveCmdResult);\n\tDELETE_THREAD_HANDLER(m_hThreadParseCmdResult);\n\tDELETE_THREAD_HANDLER(m_hSyncEventParseCmdResult);\n}\n\nvoid CMsgRecipient::Subcription(HANDLE hFile,wstring strRequestCmd)\n{\n\tm_hFileRedirect = hFile; \n\tm_strRequestCmd = strRequestCmd;\n\tm_bExist = false;\n};\n\nvoid CMsgRecipient::Unsubcription() \n{\n\tm_bExist = true;\n\tm_hFileRedirect = NULL;\n\tSleep(100);\t// \u7b49 readFiles \u5faa\u73af\u9000\u51fa\n};\n\nvoid CMsgRecipient::AddProcessFromCmd(HANDLE hProcess)\n{\n\tm_lstProcessHandle.push_back(hProcess);\n}\n\nvoid CMsgRecipient::ReadFiles() {\n\tif (NULL == m_hFileRedirect)\n\t{\n\t\treturn;\n\t}\n\n\tstring outstr = "";\n\tchar buffer[BUFSIZE] = { 0 };\n\tDWORD readBytes = 0;\n\twhile (!m_bExist)\n\t{\n\t\tmemset(buffer, 0, sizeof(char)*BUFSIZE);\n\t\t// \u5bf9\u7ba1\u9053\u6570\u636e\u8fdb\u884c\u8bfb\uff0c\u4f46\u4e0d\u4f1a\u5220\u9664\u7ba1\u9053\u91cc\u7684\u6570\u636e\uff0c\u82e5\u679c\u6ca1\u6709\u6570\u636e\uff0c\u5c31\u7acb\u5373\u8fd4\u56de\n\t\tif (!PeekNamedPipe(m_hFileRedirect, buffer, sizeof(char)*BUFSIZE, &readBytes, 0, NULL))\n\t\t{\n\t\t\tDWORD dw = GetLastError();\n\t\t\tbreak;\n\t\t}\n\n\t\t// \u68c0\u67e5\u662f\u5426\u8bfb\u5230\u6570\u636e\uff0c\u5982\u679c\u6ca1\u6709\u6570\u636e\uff0c\u7ee7\u7eed\u7b49\u5f85\n\t\tif (0 == readBytes)\n\t\t{\n\t\t\tSleep(200);\n\t\t\tcontinue;\n\t\t}\n\n\t\treadBytes = 0;\n\t\tif (ReadFile(m_hFileRedirect, buffer, sizeof(char)*BUFSIZE, &readBytes, NULL))\n\t\t{\n\t\t\tif (CopyBuffer(buffer, readBytes) == nullptr) continue;\n\n\t\t\tSetEvent(m_hSyncEventParseCmdResult);\n\t\t}\n\t}\n\n\t//DELETE_THREAD_HANDLER(m_hThreadReceiveCmdResult);\n};\n\nvoid CMsgRecipient::ParseMsg() {\n\n};\n\nvoid CMsgRecipient::RemoveProcessFormCmd(HANDLE hProcess)\n{\n\tm_lstProcessHandle.remove(hProcess);\n}\nvoid CMsgRecipient::CancelWaitProcessEnd(bool isAll)\n{\n\tif (isAll)\n\t{\n\t\twhile (m_lstProcessHandle.size())\n\t\t{\n\t\t\t// \u4e3b\u52a8\u7ec8\u6b62\u8fdb\u7a0b\n\t\t\tTerminateProcess(m_lstProcessHandle.front(), 9999);\n\t\t\tm_lstProcessHandle.pop_front();\n\t\t}\n\t}\n\telse\n\t{\n\t\tif (m_hHandleTimeOutQuitProcess != NULL && m_lstProcessHandle.front() == m_hHandleTimeOutQuitProcess)\n\t\t{\n\t\t\tTerminateProcess(m_hHandleTimeOutQuitProcess, 9999);\n\t\t\tm_hHandleTimeOutQuitProcess = NULL;\n\t\t}\n\t}\n}\n\nchar* CMsgRecipient::CopyBuffer(char* pBuffer, size_t length)\n{\n\tif (nullptr == pBuffer || length < 1)\n\t{\n\t\treturn nullptr;\n\t}\n\n\tchar* p = new char[length+2];\n\tmemset(p, 0, (length+2) * sizeof(char));\n\tmemcpy(p, pBuffer, length);\n\tm_queCache.push(std::pair<char*, size_t>(p, length));\n\treturn p; \n}\n\nvoid CMsgRecipient::DeleteCopiedBuffer(std::pair<char*, size_t> item)\n{\n\tif (item.first)\n\t{\n\t\tdelete[] item.first;\n\t\titem.first = nullptr;\n\t}\n}\n\nvoid CMsgRecipient::ParsedMsgText(const wchar_t* pContent)\n{\n}\n'})}),"\n",(0,i.jsx)(n.h1,{id:"\u63d0\u6743--\u6743\u9650\u63d0\u5347",children:"\u63d0\u6743 & \u6743\u9650\u63d0\u5347"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",children:"void CSingleMethod::EnablePrivilege()\n{\n\tHANDLE hToken = NULL;\n\tif (!OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken)) {\n\t\treturn;\n\t}\n\tTOKEN_PRIVILEGES tkp;\n\tLookupPrivilegeValue(NULL, SE_RESTORE_NAME, &tkp.Privileges[0].Luid);\n\ttkp.PrivilegeCount = 1;\n\ttkp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;\n\tAdjustTokenPrivileges(hToken, FALSE, &tkp, 0, NULL, 0);\n\tBOOL bEnabled = (GetLastError() == ERROR_SUCCESS);\n\tCloseHandle(hToken);\n}\n"})}),"\n",(0,i.jsx)(n.h1,{id:"\u8bfb\u53d6\u8fdb\u7a0b\u4fe1\u606f",children:"\u8bfb\u53d6\u8fdb\u7a0b\u4fe1\u606f"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u547d\u4ee4\u884c\u4fe1\u606f"',children:'bool CProcessInfos::GetProcessCommandLine(DWORD dwProcessId, CString &strCommandLine)\n{\n\t// open the process\n\tHANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, dwProcessId);\n\tDWORD err = 0;\n\tif (hProcess == NULL)\n\t{\n\t\terr = GetLastError();\n\t\treturn false;\n\t}\n\n\t// determine if 64 or 32-bit processor\n\tSYSTEM_INFO si;\n\tGetNativeSystemInfo(&si);\n\n\t// determine if this process is running on WOW64\n\tBOOL wow;\n\tIsWow64Process(GetCurrentProcess(), &wow);\n\n\t// use WinDbg "dt ntdll!_PEB" command and search for ProcessParameters offset to find the truth out\n\tDWORD ProcessParametersOffset = si.wProcessorArchitecture == PROCESSOR_ARCHITECTURE_AMD64 ? 0x20 : 0x10;\n\tDWORD CommandLineOffset = si.wProcessorArchitecture == PROCESSOR_ARCHITECTURE_AMD64 ? 0x70 : 0x40;\n\n\t// read basic info to get ProcessParameters address, we only need the beginning of PEB\n\tDWORD pebSize = ProcessParametersOffset + 8;\n\tPBYTE peb = (PBYTE)malloc(pebSize);\n\tZeroMemory(peb, pebSize);\n\n\t// read basic info to get CommandLine address, we only need the beginning of ProcessParameters\n\tDWORD ppSize = CommandLineOffset + 16;\n\tPBYTE pp = (PBYTE)malloc(ppSize);\n\tZeroMemory(pp, ppSize);\n\n\tPWSTR cmdLine = NULL;\n\n\tif (wow)\n\t{\n\t\t// we\'re running as a 32-bit process in a 64-bit OS\n\t\tPROCESS_BASIC_INFORMATION_WOW64 pbi;\n\t\tZeroMemory(&pbi, sizeof(pbi));\n\n\t\t// get process information from 64-bit world\n\t\t_NtQueryInformationProcess query = (_NtQueryInformationProcess)GetProcAddress(GetModuleHandleA("ntdll.dll"), "NtWow64QueryInformationProcess64");\n\t\terr = query(hProcess, 0, &pbi, sizeof(pbi), NULL);\n\t\tif (err != 0)\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\treturn false;\n\t\t}\n\n\t\t// read PEB from 64-bit address space\n\t\t_NtWow64ReadVirtualMemory64 read = (_NtWow64ReadVirtualMemory64)GetProcAddress(GetModuleHandleA("ntdll.dll"), "NtWow64ReadVirtualMemory64");\n\t\terr = read(hProcess, pbi.PebBaseAddress, peb, pebSize, NULL);\n\t\tif (err != 0)\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\treturn false;\n\t\t}\n\n\t\t// read ProcessParameters from 64-bit address space\n\t\t// PBYTE* parameters = (PBYTE*)*(LPVOID*)(peb + ProcessParametersOffset); // address in remote process address space\n\t\tPVOID64 parameters = (PVOID64) * ((PVOID64*)(peb + ProcessParametersOffset)); // corrected 64-bit address, see comments\n\t\terr = read(hProcess, parameters, pp, ppSize, NULL);\n\t\tif (err != 0)\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\treturn false;\n\t\t}\n\n\t\t// read CommandLine\n\t\tUNICODE_STRING_WOW64* pCommandLine = (UNICODE_STRING_WOW64*)(pp + CommandLineOffset);\n\t\tcmdLine = (PWSTR)malloc(pCommandLine->MaximumLength);\n\t\terr = read(hProcess, pCommandLine->Buffer, cmdLine, pCommandLine->MaximumLength, NULL);\n\t\tif (err != 0)\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\tif (NULL != cmdLine) free(cmdLine);\n\t\t\treturn false;\n\t\t}\n\t}\n\telse\n\t{\n\t\t// we\'re running as a 32-bit process in a 32-bit OS, or as a 64-bit process in a 64-bit OS\n\t\tPROCESS_BASIC_INFORMATION pbi;\n\t\tZeroMemory(&pbi, sizeof(pbi));\n\n\t\t// get process information\n\t\t_NtQueryInformationProcess query = (_NtQueryInformationProcess)GetProcAddress(GetModuleHandleA("ntdll.dll"), "NtQueryInformationProcess");\n\t\terr = query(hProcess, 0, &pbi, sizeof(pbi), NULL);\n\t\tif (err != 0)\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\treturn false;\n\t\t}\n\n\t\t// read PEB\n\t\tif (!ReadProcessMemory(hProcess, pbi.PebBaseAddress, peb, pebSize, NULL))\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\treturn false;\n\t\t}\n\n\t\t// read ProcessParameters\n\t\tPBYTE* parameters = (PBYTE*)*(LPVOID*)(peb + ProcessParametersOffset); // address in remote process adress space\n\t\tif (!ReadProcessMemory(hProcess, parameters, pp, ppSize, NULL))\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\treturn false;\n\t\t}\n\n\t\t// read CommandLine\n\t\tUNICODE_STRING* pCommandLine = (UNICODE_STRING*)(pp + CommandLineOffset);\n\t\tcmdLine = (PWSTR)malloc(pCommandLine->MaximumLength);\n\t\tif (!ReadProcessMemory(hProcess, pCommandLine->Buffer, cmdLine, pCommandLine->MaximumLength, NULL))\n\t\t{\n\t\t\tCloseHandle(hProcess);\n\t\t\tfree(peb);\n\t\t\tfree(pp);\n\t\t\tif (NULL != cmdLine) free(cmdLine);\n\t\t\treturn false;\n\t\t}\n\t\tstrCommandLine = cmdLine;\n\t\tfree(peb);\n\t\tfree(pp);\n\t\tif (NULL != cmdLine) free(cmdLine);\n\t}\n\tCloseHandle(hProcess);\n\treturn true;\n}\n'})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-cpp",metastring:'title="\u7f6e\u9876"',children:"bool CProcessInfos::ProcessWndTopMost(CString strProcessName)\n{\n\tbool bRes = false;\n\n\tDWORD aProcesses[1024], cbNeeded, cProcesses;\n\tunsigned int i;\n\tif (!EnumProcesses(aProcesses, sizeof(aProcesses), &cbNeeded))\n\t{\n\t\treturn false;\n\t}\n\n\tcProcesses = cbNeeded / sizeof(DWORD);\n\tfor (i = 0; i < cProcesses; i++)\n\t{\n\t\tif (aProcesses[i] != 0)\n\t\t{\n\t\t\tCString strTempName;\n\t\t\tif (GetProcessCommandLine(aProcesses[i], strTempName))\n\t\t\t{\n\t\t\t\tif (strTempName.Find(strProcessName) != -1)\n\t\t\t\t{\n\t\t\t\t\tRtlZeroMemory(&s_topMostWndInfo, sizeof(TOP_MOST_WND_INFO));\n\t\t\t\t\ts_topMostWndInfo.dwProcessId = aProcesses[i];\n\t\t\t\t\twcscpy(s_topMostWndInfo.szMainWndTitle, strProcessName.GetBuffer());\n\t\t\t\t\tstrProcessName.ReleaseBuffer();\n\t\t\t\t\tEnumWindows((WNDENUMPROC)EnumWindowsProc, s_topMostWndInfo.dwProcessId);\n\t\t\t\t\tShowWindow(s_topMostWndInfo.hWnd, SW_MINIMIZE);\n\t\t\t\t\tShowWindow(s_topMostWndInfo.hWnd, SW_NORMAL);\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\treturn bRes;\n}\n\nTOP_MOST_WND_INFO CProcessInfos::s_topMostWndInfo = {0};\nbool CProcessInfos::EnumWindowsProc(HWND hwnd, DWORD lParam)\n{\n\tint i = GetWindowTextLength(hwnd);\n\tTCHAR szhello[255] = { 0 };\n\tGetWindowText(hwnd, szhello, i + 1);\n\tif (wcscmp(szhello, s_topMostWndInfo.szMainWndTitle) == 0)\n\t{\n\t\ts_topMostWndInfo.hWnd = hwnd;\n\t\treturn FALSE;\n\t}\n\treturn TRUE;\n}\n"})})]})}function c(t={}){const{wrapper:n}={...(0,s.R)(),...t.components};return n?(0,i.jsx)(n,{...t,children:(0,i.jsx)(u,{...t})}):u(t)}},8453:(t,n,e)=>{e.d(n,{R:()=>o,x:()=>a});var i=e(6540);const s={},r=i.createContext(s);function o(t){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof t?t(n):{...n,...t}}),[n,t])}function a(t){let n;return n=t.disableParentContext?"function"==typeof t.components?t.components(s):t.components||s:o(t.components),i.createElement(r.Provider,{value:n},t.children)}}}]);