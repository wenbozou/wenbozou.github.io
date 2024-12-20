---
sidebar_label: 'SignPropertyHandler'
sidebar_position: 4
---


# 简介
SignPropertyHandler是一个用来处理并处理在Windows 资源浏览器新增列显示exe、dll、sys 文件签名属性的属性处理程序。

# 方案
1.使用新开发的SingleFilePropertyHandler.dll 属性处理程序替换exe Exe Dll Sys 默认属性处理程序。
参考[链接](https://stackoverflow.com/questions/9648275/display-custom-header-or-column-in-windows-explorer)
2.属性架构：定义自定义属性Key和值，并在属性架构文件中注册。
3.属性处理程序：定义自定义属性和值，从文件中读取签名信息或详细信息，并写入到自定义属性中;

# 项目搭建
## 自定义属性&属性说明架构
1. [属性架构](https://learn.microsoft.com/zh-cn/windows/win32/properties/building-property-handlers-property-schemas)
2. 参考代码示例[Demo](https://github.com/wenbozou/Windows-classic-samples/tree/main/Samples/Win7Samples/winui/shell/appplatform/propertyschemas)
3. 更新属性值、查看支持的属性[Demo](https://github.com/wenbozou/Windows-classic-samples/tree/main/Samples/Win7Samples/winui/shell/appplatform/PropertyEdit)
4. 创建SignProperties.propdesc文件，添加自定义属性,如下所示
```xml title="SignProperties.propdesc"
<?xml version="1.0" encoding="utf-8"?>
<!--

    This propdesc file contains the descriptions of Recipe Sample custom properties.
    To register/unregister, use the PropertySchema SDK sample, or http://www.codeplex.com/prop.

-->
<schema xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="http://schemas.microsoft.com/windows/2006/propertydescription"
        schemaVersion="1.0">
  <propertyDescriptionList publisher="Tenorshare" product="SampleSign">
    <propertyDescription name="Tenorshare.SampleSign.Name" formatID="{62047AD5-214A-400A-8296-217B103BBE3F}" propID="100">
      <description>Sign Name Info</description>
      <searchInfo inInvertedIndex="true" isColumn="true"/>
      <typeInfo type="String" multipleValues="false" isViewable="true" isQueryable="true"/>
      <labelInfo label="Sign Name" invitationText="Specify Sign Name" />
    </propertyDescription>
	<propertyDescription name="Tenorshare.SampleSign.Email" formatID="{5385F2EF-3618-4EB1-A157-30C92FB2E7AB}" propID="101">
      <description>Sign Email Info</description>
      <searchInfo inInvertedIndex="true" isColumn="true"/>
      <typeInfo type="String" multipleValues="false" isViewable="true" isQueryable="true"/>
      <labelInfo label="Sign Email" invitationText="Specify Sign Email" />
    </propertyDescription>
	<propertyDescription name="Tenorshare.SampleSign.Date" formatID="{5F85795E-0D0E-4A36-A808-B3B7F1CEC3FF}" propID="102">
      <description>Sign Date Info</description>
      <searchInfo inInvertedIndex="true" isColumn="true"/>
      <typeInfo type="String" multipleValues="false" isViewable="true" isQueryable="true"/>
      <labelInfo label="Sign Date" invitationText="Specify Sign Date" />
    </propertyDescription>
  </propertyDescriptionList>
</schema>
```

## 开发属性处理程序
1. Windows 属性处理程序[开发指南](https://learn.microsoft.com/zh-cn/windows/win32/properties/property-system-developer-s-guide)
2. 参考代码示例[Demo](https://github.com/wenbozou/Windows-classic-samples/tree/main/Samples/Win7Samples/winui/shell/appshellintegration/RecipePropertyHandler)
3. 在步骤2的基础上,修改项目代码(重新创建项目工程，添加相应的代码文件，编译未通过，具体原因没定位到)
4. 属性Key值定义
```cpp title=""
// {62047AD5-214A-400A-8296-217B103BBE3F}
const PROPERTYKEY PKEY_Tenorshare_SampleSign_Name = { {0x62047AD5, 0x214A, 0x400A, 0x82,0x96,0x21,0x7B,0x10,0x3B,0xBE,0x3F}, 100 };
// {5385F2EF-3618-4EB1-A157-30C92FB2E7AB}
const PROPERTYKEY PKEY_Tenorshare_SampleSign_Email = { {0x5385f2ef, 0x3618, 0x4eb1, 0xa1, 0x57, 0x30, 0xc9, 0x2f, 0xb2, 0xe7, 0xab}, 101 };
// {5F85795E-0D0E-4A36-A808-B3B7F1CEC3FF}
const PROPERTYKEY PKEY_Tenorshare_SampleSign_Date = { {0x5f85795e, 0xd0e, 0x4a36, 0xa8, 0x8, 0xb3, 0xb7, 0xf1, 0xce, 0xc3, 0xff}, 102 };

// 在propkey.h头文件中未找到PKEY_Software_ProductVersion， 根据产品版本的CanonicalName "System.Software.ProductVersion" 读取对应的 PROPERTYKEY 值并写死
// {0CEF7D53-FA64-11D1-A230000F81FEDEE}
const PROPERTYKEY PKEY_Software_ProductVersion = { {0x0CEF7D53, 0xFA64, 0x11D1, 0xA2, 0x03, 0x00, 0xb00, 0xF8, 0x1F, 0xED, 0xEE}, 8 };

// Map of property keys to the locations of their value(s) in the .recipe XML schema
struct PROPERTYMAP
{
	const PROPERTYKEY *pkey;    // pointer type to enable static declaration
};

const PROPERTYMAP g_rgPROPERTYMAP[] =
{
	{&PKEY_Tenorshare_SampleSign_Name},
	{&PKEY_Tenorshare_SampleSign_Email},
	{&PKEY_Tenorshare_SampleSign_Date},
};

const PROPERTYMAP g_rgPROPERTYMAP_DETAILS[] =
{
	{ &PKEY_Comment},
	{ &PKEY_InternalName},
	{ &PKEY_Software_ProductName},

	{ &PKEY_Company},
	{ &PKEY_Copyright},
	{ &PKEY_Software_ProductVersion},

	{ &PKEY_FileDescription},
	{ &PKEY_Trademarks},
	//{ &PKEY_PrivateBuild},

	{ &PKEY_FileVersion},
	{ &PKEY_OriginalFileName},
	//{ &PKEY_SpecialBuild},
};
```

5.属性处理类继承自IPropertyStore、IPropertyStoreCapabilities、IInitializeWithFile

6. IUnknown 接口实现
```cpp title="IUnknown"
// IUnknown
IFACEMETHODIMP QueryInterface(REFIID riid, void **ppv)
{
static const QITAB qit[] = {
QITABENT(CSignPropertyHandler, IPropertyStore),
QITABENT(CSignPropertyHandler, IPropertyStoreCapabilities),
QITABENT(CSignPropertyHandler, IInitializeWithFile),
//QITABENT(CSignPropertyHandler, IInitializeWithStream),
{ 0 },
};
return QISearch(this, qit, riid, ppv);
}
```

7. IPropertyStore 接口实现
```cpp title="IPropertyStore"
HRESULT CSignPropertyHandler::GetCount(DWORD *pcProps)
{
	*pcProps = 0;
	return _pCache ? _pCache->GetCount(pcProps) : E_UNEXPECTED;
}

HRESULT CSignPropertyHandler::GetAt(DWORD iProp, PROPERTYKEY *pkey)
{
	*pkey = PKEY_Null;
	return _pCache ? _pCache->GetAt(iProp, pkey) : E_UNEXPECTED;
}

HRESULT CSignPropertyHandler::GetValue(REFPROPERTYKEY key, PROPVARIANT *pPropVar)
{
	PropVariantInit(pPropVar);
	return _pCache ? _pCache->GetValue(key, pPropVar) : E_UNEXPECTED;
}

// SetValue just updates the internal value cache
HRESULT CSignPropertyHandler::SetValue(REFPROPERTYKEY key, REFPROPVARIANT propVar)
{
	HRESULT hr = E_UNEXPECTED;
	if (_pCache)
	{
		// check grfMode to ensure writes are allowed
		hr = STG_E_ACCESSDENIED;
		if ((_grfMode & STGM_READWRITE) &&
			(key != PKEY_Search_Contents))  // this property is read-only
		{
			hr = _pCache->SetValueAndState(key, &propVar, PSC_DIRTY);
		}
	}

	return hr;
}

// Commit writes the internal value cache back out to the stream passed to Initialize
HRESULT CSignPropertyHandler::Commit()
{
	HRESULT hr = S_OK;
	return hr;
}
```

8. IPropertyStoreCapabilities 接口实现
```cpp title="IPropertyStoreCapabilities"
HRESULT CSignPropertyHandler::IsPropertyWritable(REFPROPERTYKEY key)
{
	// System.Search.Contents is the only property not supported for writing
	return (key == PKEY_Search_Contents) ? S_FALSE : S_OK;
}
``` 
9.  IInitializeWithFile 接口实现
```cpp title="IInitializeWithFile"
IFACEMETHODIMP CSignPropertyHandler::Initialize(LPCWSTR pszFilePath, DWORD grfMode)
{
	HRESULT hr = S_OK;// E_UNEXPECTED;

	if (CFileHelper::FileExist(pszFilePath))
	{
		// load the internal value cache from the DOM object
		hr = _LoadCacheFromDom(pszFilePath);
		if (SUCCEEDED(hr))
		{
			// save a reference to the stream as well as the grfMode
			//hr = pStream->QueryInterface(IID_PPV_ARGS(&_pStream));
			//if (SUCCEEDED(hr))
			{
				_grfMode = grfMode;
			}
		}
	}
	_grfMode = grfMode;
	return hr;
}
``` 

10.创建内部值缓存
```cpp
// create the internal value cache
hr = PSCreateMemoryPropertyStore(IID_PPV_ARGS(&_pCache));
```
11.从文件读取签名信息并写入缓存
```cpp
void CSignPropertyHandler::SignColumns(LPCWSTR pszFilePath)
{
	SPROG_SIGNERINFO *pFileSignerInfo = (SPROG_SIGNERINFO *)malloc(sizeof(SPROG_SIGNERINFO));
	ZeroMemory(pFileSignerInfo, sizeof(SPROG_SIGNERINFO));
	CSignDigitalInfo signDigitalInfo;
	signDigitalInfo.Query(pszFilePath, &pFileSignerInfo);

	for (UINT i = 0; i < ARRAYSIZE(g_rgPROPERTYMAP); ++i)
	{
		switch (i)
		{
		case 0:
			if (pFileSignerInfo->lpszSubjectName != NULL)
			{
				if (wcslen(pFileSignerInfo->lpszSubjectName) > 1)
				{
					_LoadProperty(g_rgPROPERTYMAP[i], pFileSignerInfo->lpszSubjectName);
				}
				else
				{
					_LoadProperty(g_rgPROPERTYMAP[i], c_szDefaultUnsignTag);
				}
			}
			else
			{
				_LoadProperty(g_rgPROPERTYMAP[i], c_szDefaultUnsignTag);
			}
			break;
		case 1:
			if (pFileSignerInfo->lpszSubjectEmail != NULL)
			{
				_LoadProperty(g_rgPROPERTYMAP[i], pFileSignerInfo->lpszSubjectEmail);
			}
			break;
		case 2:
			if (pFileSignerInfo->lpszDateTime != NULL)
			{
				_LoadProperty(g_rgPROPERTYMAP[i], pFileSignerInfo->lpszDateTime);
			}
			break;
		}
	}
	CSignDigitalInfo::FreeSafe(pFileSignerInfo);
}
```
12.从文件读详细信息并写入缓存
```cpp
void CSignPropertyHandler::DetailsColumns(LPCWSTR pszFilePath)
{
	Version_Info *pVerInfo = nullptr;
	CFileVersionInfo::Query(pszFilePath, &pVerInfo);
	if (pVerInfo != nullptr)
	{
		try {
			for (UINT i = 0; i < ARRAYSIZE(g_rgPROPERTYMAP_DETAILS); ++i)
			{
				switch (i)
				{
				case 0:
					if (pVerInfo->lpszComments != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszComments);
					}
					break;
				case 1:
					// 忽略，否则会导致explorer 重复关闭
					/*if (pVerInfo->lpszInternalName != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszInternalName);
					}*/
					break;
				case 2:
					if (pVerInfo->lpszProductName != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszProductName);
					}
					break;

				case 3:
					if (pVerInfo->lpszCompanyName != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszCompanyName);
					}
					break;
				case 4:
					if (pVerInfo->lpszLegalCopyright != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszLegalCopyright);
					}
					break;
				case 5:
					if (pVerInfo->lpszProductVersion != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszProductVersion);
						/*
						IPropertyDescription* ppd = NULL;
						HRESULT hr = PSGetPropertyDescriptionByName(L"System.Software.ProductVersion", IID_PPV_ARGS(&ppd));
						if (SUCCEEDED(hr))
						{
							PROPERTYKEY propKey;
							hr = ppd->GetPropertyKey(&propKey);
							if (SUCCEEDED(hr))
							{
								PROPERTYMAP propMap;
								propMap.pkey = &propKey;
								_LoadProperty(propMap, pVerInfo->lpszProductVersion);
							}
							ppd->Release();
						}//*/
					}
					break;

				case 6:
					if (pVerInfo->lpszFileDescription != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszFileDescription);
					}
					break;
				case 7:
					// 忽略，否则会导致explorer 重复关闭
					/*if (pVerInfo->lpszFileVersion != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszLegalTrademarks);
					}*/
					break;
				case 8:
					if (pVerInfo->lpszFileVersion != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszFileVersion);
					}
					break;
				case 9:
					if (pVerInfo->lpszOriginalFilename != NULL)
					{
						_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszOriginalFilename);
					}
					break;
				case 10:
					break;
				case 11:
					break;
				}
			}
		}
		catch (...) {
		}
	}

	CFileVersionInfo::FreeSafe(pVerInfo);
}
```

13.注册:写注册表
```cpp
HRESULT RegisterHandler()
{
	// register the property handler COM object with the system
	CRegisterExtension re(__uuidof(CSignPropertyHandler), HKEY_LOCAL_MACHINE);
	HRESULT hr = re.RegisterInProcServer(c_szPropertyHandlerDescription, L"Both");
	if (SUCCEEDED(hr))
	{
		hr = re.RegisterInProcServerAttribute(L"ManualSafeSave", TRUE);
		if (SUCCEEDED(hr))
		{
			hr = re.RegisterPropertyHandler(c_szExeFileExtension);
			hr = re.RegisterPropertyHandler(c_szDllFileExtension);
			hr = re.RegisterPropertyHandler(c_szSysFileExtension);
			hr = re.RegisterPropertyHandler(c_szMsiFileExtension);
		}
		
	}

	return hr;
}
```

14.卸载:从注册表中删除
```cpp
HRESULT UnregisterHandler()
{
	CRegisterExtension re(__uuidof(CExePropertyHandler), HKEY_LOCAL_MACHINE);
	HRESULT hr = re.RegisterPropertyHandler(c_szExeFileExtension);
	hr = re.RegisterPropertyHandler(c_szDllFileExtension);
	hr = re.RegisterPropertyHandler(c_szSysFileExtension);

	CRegisterExtension reMsi(__uuidof(CMsiPropertyHandler), HKEY_LOCAL_MACHINE);
	hr = reMsi.RegisterPropertyHandler(c_szMsiFileExtension);
	return hr;
}
```

# 读取文件(exe、dll、sys)签名信息
参考[链接](https://blog.csdn.net/earbao/article/details/22384995)

# 读取文件(exe、dll、sys)详细信息
1.参考链接[Demo](https://xmuli.tech/posts/f7b60695/)
2.参考[Api](https://learn.microsoft.com/en-us/windows/win32/api/winver/nf-winver-verqueryvaluea)
3.先读取 rc 中的语言ID,再根据语言ID读取资源信息。
4.可使用UltraEdit 打开文件，查看文件详细信息。