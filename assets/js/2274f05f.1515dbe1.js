"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[129],{6573:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>s,metadata:()=>a,toc:()=>p});var r=n(4848),i=n(8453);const s={sidebar_label:"SignPropertyHandler",sidebar_position:4},o="\u7b80\u4ecb",a={id:"SignPropertyHandler",title:"\u7b80\u4ecb",description:"SignPropertyHandler\u662f\u4e00\u4e2a\u7528\u6765\u5904\u7406\u5e76\u5904\u7406\u5728Windows \u8d44\u6e90\u6d4f\u89c8\u5668\u65b0\u589e\u5217\u663e\u793aexe\u3001dll\u3001sys \u6587\u4ef6\u7b7e\u540d\u5c5e\u6027\u7684\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f\u3002",source:"@site/docs/SignPropertyHandler.md",sourceDirName:".",slug:"/SignPropertyHandler",permalink:"/docs/SignPropertyHandler",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/SignPropertyHandler.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_label:"SignPropertyHandler",sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"ProductDumpFileAnalysis",permalink:"/docs/ProductDumpFileAnalysis"},next:{title:"config-center-demo",permalink:"/docs/config-center-demo"}},l={},p=[{value:"\u81ea\u5b9a\u4e49\u5c5e\u6027&amp;\u5c5e\u6027\u8bf4\u660e\u67b6\u6784",id:"\u81ea\u5b9a\u4e49\u5c5e\u6027\u5c5e\u6027\u8bf4\u660e\u67b6\u6784",level:2},{value:"\u5f00\u53d1\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f",id:"\u5f00\u53d1\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f",level:2}];function c(t){const e={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.R)(),...t.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(e.header,{children:(0,r.jsx)(e.h1,{id:"\u7b80\u4ecb",children:"\u7b80\u4ecb"})}),"\n",(0,r.jsx)(e.p,{children:"SignPropertyHandler\u662f\u4e00\u4e2a\u7528\u6765\u5904\u7406\u5e76\u5904\u7406\u5728Windows \u8d44\u6e90\u6d4f\u89c8\u5668\u65b0\u589e\u5217\u663e\u793aexe\u3001dll\u3001sys \u6587\u4ef6\u7b7e\u540d\u5c5e\u6027\u7684\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f\u3002"}),"\n",(0,r.jsx)(e.h1,{id:"\u65b9\u6848",children:"\u65b9\u6848"}),"\n",(0,r.jsxs)(e.p,{children:["1.\u4f7f\u7528\u65b0\u5f00\u53d1\u7684SingleFilePropertyHandler.dll \u5c5e\u6027\u5904\u7406\u7a0b\u5e8f\u66ff\u6362exe Exe Dll Sys \u9ed8\u8ba4\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f\u3002\n\u53c2\u8003",(0,r.jsx)(e.a,{href:"https://stackoverflow.com/questions/9648275/display-custom-header-or-column-in-windows-explorer",children:"\u94fe\u63a5"}),"\n2.\u5c5e\u6027\u67b6\u6784\uff1a\u5b9a\u4e49\u81ea\u5b9a\u4e49\u5c5e\u6027Key\u548c\u503c\uff0c\u5e76\u5728\u5c5e\u6027\u67b6\u6784\u6587\u4ef6\u4e2d\u6ce8\u518c\u3002\n3.\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f\uff1a\u5b9a\u4e49\u81ea\u5b9a\u4e49\u5c5e\u6027\u548c\u503c\uff0c\u4ece\u6587\u4ef6\u4e2d\u8bfb\u53d6\u7b7e\u540d\u4fe1\u606f\u6216\u8be6\u7ec6\u4fe1\u606f\uff0c\u5e76\u5199\u5165\u5230\u81ea\u5b9a\u4e49\u5c5e\u6027\u4e2d;"]}),"\n",(0,r.jsx)(e.h1,{id:"\u9879\u76ee\u642d\u5efa",children:"\u9879\u76ee\u642d\u5efa"}),"\n",(0,r.jsx)(e.h2,{id:"\u81ea\u5b9a\u4e49\u5c5e\u6027\u5c5e\u6027\u8bf4\u660e\u67b6\u6784",children:"\u81ea\u5b9a\u4e49\u5c5e\u6027&\u5c5e\u6027\u8bf4\u660e\u67b6\u6784"}),"\n",(0,r.jsxs)(e.ol,{children:["\n",(0,r.jsx)(e.li,{children:(0,r.jsx)(e.a,{href:"https://learn.microsoft.com/zh-cn/windows/win32/properties/building-property-handlers-property-schemas",children:"\u5c5e\u6027\u67b6\u6784"})}),"\n",(0,r.jsxs)(e.li,{children:["\u53c2\u8003\u4ee3\u7801\u793a\u4f8b",(0,r.jsx)(e.a,{href:"https://github.com/wenbozou/Windows-classic-samples/tree/main/Samples/Win7Samples/winui/shell/appplatform/propertyschemas",children:"Demo"})]}),"\n",(0,r.jsxs)(e.li,{children:["\u66f4\u65b0\u5c5e\u6027\u503c\u3001\u67e5\u770b\u652f\u6301\u7684\u5c5e\u6027",(0,r.jsx)(e.a,{href:"https://github.com/wenbozou/Windows-classic-samples/tree/main/Samples/Win7Samples/winui/shell/appplatform/PropertyEdit",children:"Demo"})]}),"\n",(0,r.jsx)(e.li,{children:"\u521b\u5efaSignProperties.propdesc\u6587\u4ef6\uff0c\u6dfb\u52a0\u81ea\u5b9a\u4e49\u5c5e\u6027,\u5982\u4e0b\u6240\u793a"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-xml",metastring:'title="SignProperties.propdesc"',children:'<?xml version="1.0" encoding="utf-8"?>\n\x3c!--\n\n    This propdesc file contains the descriptions of Recipe Sample custom properties.\n    To register/unregister, use the PropertySchema SDK sample, or http://www.codeplex.com/prop.\n\n--\x3e\n<schema xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xmlns="http://schemas.microsoft.com/windows/2006/propertydescription"\n        schemaVersion="1.0">\n  <propertyDescriptionList publisher="Tenorshare" product="SampleSign">\n    <propertyDescription name="Tenorshare.SampleSign.Name" formatID="{62047AD5-214A-400A-8296-217B103BBE3F}" propID="100">\n      <description>Sign Name Info</description>\n      <searchInfo inInvertedIndex="true" isColumn="true"/>\n      <typeInfo type="String" multipleValues="false" isViewable="true" isQueryable="true"/>\n      <labelInfo label="Sign Name" invitationText="Specify Sign Name" />\n    </propertyDescription>\n\t<propertyDescription name="Tenorshare.SampleSign.Email" formatID="{5385F2EF-3618-4EB1-A157-30C92FB2E7AB}" propID="101">\n      <description>Sign Email Info</description>\n      <searchInfo inInvertedIndex="true" isColumn="true"/>\n      <typeInfo type="String" multipleValues="false" isViewable="true" isQueryable="true"/>\n      <labelInfo label="Sign Email" invitationText="Specify Sign Email" />\n    </propertyDescription>\n\t<propertyDescription name="Tenorshare.SampleSign.Date" formatID="{5F85795E-0D0E-4A36-A808-B3B7F1CEC3FF}" propID="102">\n      <description>Sign Date Info</description>\n      <searchInfo inInvertedIndex="true" isColumn="true"/>\n      <typeInfo type="String" multipleValues="false" isViewable="true" isQueryable="true"/>\n      <labelInfo label="Sign Date" invitationText="Specify Sign Date" />\n    </propertyDescription>\n  </propertyDescriptionList>\n</schema>\n'})}),"\n",(0,r.jsx)(e.h2,{id:"\u5f00\u53d1\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f",children:"\u5f00\u53d1\u5c5e\u6027\u5904\u7406\u7a0b\u5e8f"}),"\n",(0,r.jsxs)(e.ol,{children:["\n",(0,r.jsxs)(e.li,{children:["Windows \u5c5e\u6027\u5904\u7406\u7a0b\u5e8f",(0,r.jsx)(e.a,{href:"https://learn.microsoft.com/zh-cn/windows/win32/properties/property-system-developer-s-guide",children:"\u5f00\u53d1\u6307\u5357"})]}),"\n",(0,r.jsxs)(e.li,{children:["\u53c2\u8003\u4ee3\u7801\u793a\u4f8b",(0,r.jsx)(e.a,{href:"https://github.com/wenbozou/Windows-classic-samples/tree/main/Samples/Win7Samples/winui/shell/appshellintegration/RecipePropertyHandler",children:"Demo"})]}),"\n",(0,r.jsx)(e.li,{children:"\u5728\u6b65\u9aa42\u7684\u57fa\u7840\u4e0a,\u4fee\u6539\u9879\u76ee\u4ee3\u7801(\u91cd\u65b0\u521b\u5efa\u9879\u76ee\u5de5\u7a0b\uff0c\u6dfb\u52a0\u76f8\u5e94\u7684\u4ee3\u7801\u6587\u4ef6\uff0c\u7f16\u8bd1\u672a\u901a\u8fc7\uff0c\u5177\u4f53\u539f\u56e0\u6ca1\u5b9a\u4f4d\u5230)"}),"\n",(0,r.jsx)(e.li,{children:"\u5c5e\u6027Key\u503c\u5b9a\u4e49"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",metastring:'title=""',children:'// {62047AD5-214A-400A-8296-217B103BBE3F}\nconst PROPERTYKEY PKEY_Tenorshare_SampleSign_Name = { {0x62047AD5, 0x214A, 0x400A, 0x82,0x96,0x21,0x7B,0x10,0x3B,0xBE,0x3F}, 100 };\n// {5385F2EF-3618-4EB1-A157-30C92FB2E7AB}\nconst PROPERTYKEY PKEY_Tenorshare_SampleSign_Email = { {0x5385f2ef, 0x3618, 0x4eb1, 0xa1, 0x57, 0x30, 0xc9, 0x2f, 0xb2, 0xe7, 0xab}, 101 };\n// {5F85795E-0D0E-4A36-A808-B3B7F1CEC3FF}\nconst PROPERTYKEY PKEY_Tenorshare_SampleSign_Date = { {0x5f85795e, 0xd0e, 0x4a36, 0xa8, 0x8, 0xb3, 0xb7, 0xf1, 0xce, 0xc3, 0xff}, 102 };\n\n// \u5728propkey.h\u5934\u6587\u4ef6\u4e2d\u672a\u627e\u5230PKEY_Software_ProductVersion\uff0c \u6839\u636e\u4ea7\u54c1\u7248\u672c\u7684CanonicalName "System.Software.ProductVersion" \u8bfb\u53d6\u5bf9\u5e94\u7684 PROPERTYKEY \u503c\u5e76\u5199\u6b7b\n// {0CEF7D53-FA64-11D1-A230000F81FEDEE}\nconst PROPERTYKEY PKEY_Software_ProductVersion = { {0x0CEF7D53, 0xFA64, 0x11D1, 0xA2, 0x03, 0x00, 0xb00, 0xF8, 0x1F, 0xED, 0xEE}, 8 };\n\n// Map of property keys to the locations of their value(s) in the .recipe XML schema\nstruct PROPERTYMAP\n{\n\tconst PROPERTYKEY *pkey;    // pointer type to enable static declaration\n};\n\nconst PROPERTYMAP g_rgPROPERTYMAP[] =\n{\n\t{&PKEY_Tenorshare_SampleSign_Name},\n\t{&PKEY_Tenorshare_SampleSign_Email},\n\t{&PKEY_Tenorshare_SampleSign_Date},\n};\n\nconst PROPERTYMAP g_rgPROPERTYMAP_DETAILS[] =\n{\n\t{ &PKEY_Comment},\n\t{ &PKEY_InternalName},\n\t{ &PKEY_Software_ProductName},\n\n\t{ &PKEY_Company},\n\t{ &PKEY_Copyright},\n\t{ &PKEY_Software_ProductVersion},\n\n\t{ &PKEY_FileDescription},\n\t{ &PKEY_Trademarks},\n\t//{ &PKEY_PrivateBuild},\n\n\t{ &PKEY_FileVersion},\n\t{ &PKEY_OriginalFileName},\n\t//{ &PKEY_SpecialBuild},\n};\n'})}),"\n",(0,r.jsx)(e.p,{children:"5.\u5c5e\u6027\u5904\u7406\u7c7b\u7ee7\u627f\u81eaIPropertyStore\u3001IPropertyStoreCapabilities\u3001IInitializeWithFile"}),"\n",(0,r.jsxs)(e.ol,{start:"6",children:["\n",(0,r.jsx)(e.li,{children:"IUnknown \u63a5\u53e3\u5b9e\u73b0"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",metastring:'title="IUnknown"',children:"// IUnknown\nIFACEMETHODIMP QueryInterface(REFIID riid, void **ppv)\n{\nstatic const QITAB qit[] = {\nQITABENT(CSignPropertyHandler, IPropertyStore),\nQITABENT(CSignPropertyHandler, IPropertyStoreCapabilities),\nQITABENT(CSignPropertyHandler, IInitializeWithFile),\n//QITABENT(CSignPropertyHandler, IInitializeWithStream),\n{ 0 },\n};\nreturn QISearch(this, qit, riid, ppv);\n}\n"})}),"\n",(0,r.jsxs)(e.ol,{start:"7",children:["\n",(0,r.jsx)(e.li,{children:"IPropertyStore \u63a5\u53e3\u5b9e\u73b0"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",metastring:'title="IPropertyStore"',children:"HRESULT CSignPropertyHandler::GetCount(DWORD *pcProps)\n{\n\t*pcProps = 0;\n\treturn _pCache ? _pCache->GetCount(pcProps) : E_UNEXPECTED;\n}\n\nHRESULT CSignPropertyHandler::GetAt(DWORD iProp, PROPERTYKEY *pkey)\n{\n\t*pkey = PKEY_Null;\n\treturn _pCache ? _pCache->GetAt(iProp, pkey) : E_UNEXPECTED;\n}\n\nHRESULT CSignPropertyHandler::GetValue(REFPROPERTYKEY key, PROPVARIANT *pPropVar)\n{\n\tPropVariantInit(pPropVar);\n\treturn _pCache ? _pCache->GetValue(key, pPropVar) : E_UNEXPECTED;\n}\n\n// SetValue just updates the internal value cache\nHRESULT CSignPropertyHandler::SetValue(REFPROPERTYKEY key, REFPROPVARIANT propVar)\n{\n\tHRESULT hr = E_UNEXPECTED;\n\tif (_pCache)\n\t{\n\t\t// check grfMode to ensure writes are allowed\n\t\thr = STG_E_ACCESSDENIED;\n\t\tif ((_grfMode & STGM_READWRITE) &&\n\t\t\t(key != PKEY_Search_Contents))  // this property is read-only\n\t\t{\n\t\t\thr = _pCache->SetValueAndState(key, &propVar, PSC_DIRTY);\n\t\t}\n\t}\n\n\treturn hr;\n}\n\n// Commit writes the internal value cache back out to the stream passed to Initialize\nHRESULT CSignPropertyHandler::Commit()\n{\n\tHRESULT hr = S_OK;\n\treturn hr;\n}\n"})}),"\n",(0,r.jsxs)(e.ol,{start:"8",children:["\n",(0,r.jsx)(e.li,{children:"IPropertyStoreCapabilities \u63a5\u53e3\u5b9e\u73b0"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",metastring:'title="IPropertyStoreCapabilities"',children:"HRESULT CSignPropertyHandler::IsPropertyWritable(REFPROPERTYKEY key)\n{\n\t// System.Search.Contents is the only property not supported for writing\n\treturn (key == PKEY_Search_Contents) ? S_FALSE : S_OK;\n}\n"})}),"\n",(0,r.jsxs)(e.ol,{start:"9",children:["\n",(0,r.jsx)(e.li,{children:"IInitializeWithFile \u63a5\u53e3\u5b9e\u73b0"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",metastring:'title="IInitializeWithFile"',children:"IFACEMETHODIMP CSignPropertyHandler::Initialize(LPCWSTR pszFilePath, DWORD grfMode)\n{\n\tHRESULT hr = S_OK;// E_UNEXPECTED;\n\n\tif (CFileHelper::FileExist(pszFilePath))\n\t{\n\t\t// load the internal value cache from the DOM object\n\t\thr = _LoadCacheFromDom(pszFilePath);\n\t\tif (SUCCEEDED(hr))\n\t\t{\n\t\t\t// save a reference to the stream as well as the grfMode\n\t\t\t//hr = pStream->QueryInterface(IID_PPV_ARGS(&_pStream));\n\t\t\t//if (SUCCEEDED(hr))\n\t\t\t{\n\t\t\t\t_grfMode = grfMode;\n\t\t\t}\n\t\t}\n\t}\n\t_grfMode = grfMode;\n\treturn hr;\n}\n"})}),"\n",(0,r.jsx)(e.p,{children:"10.\u521b\u5efa\u5185\u90e8\u503c\u7f13\u5b58"}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",children:"// create the internal value cache\nhr = PSCreateMemoryPropertyStore(IID_PPV_ARGS(&_pCache));\n"})}),"\n",(0,r.jsx)(e.p,{children:"11.\u4ece\u6587\u4ef6\u8bfb\u53d6\u7b7e\u540d\u4fe1\u606f\u5e76\u5199\u5165\u7f13\u5b58"}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",children:"void CSignPropertyHandler::SignColumns(LPCWSTR pszFilePath)\n{\n\tSPROG_SIGNERINFO *pFileSignerInfo = (SPROG_SIGNERINFO *)malloc(sizeof(SPROG_SIGNERINFO));\n\tZeroMemory(pFileSignerInfo, sizeof(SPROG_SIGNERINFO));\n\tCSignDigitalInfo signDigitalInfo;\n\tsignDigitalInfo.Query(pszFilePath, &pFileSignerInfo);\n\n\tfor (UINT i = 0; i < ARRAYSIZE(g_rgPROPERTYMAP); ++i)\n\t{\n\t\tswitch (i)\n\t\t{\n\t\tcase 0:\n\t\t\tif (pFileSignerInfo->lpszSubjectName != NULL)\n\t\t\t{\n\t\t\t\tif (wcslen(pFileSignerInfo->lpszSubjectName) > 1)\n\t\t\t\t{\n\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP[i], pFileSignerInfo->lpszSubjectName);\n\t\t\t\t}\n\t\t\t\telse\n\t\t\t\t{\n\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP[i], c_szDefaultUnsignTag);\n\t\t\t\t}\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t\t_LoadProperty(g_rgPROPERTYMAP[i], c_szDefaultUnsignTag);\n\t\t\t}\n\t\t\tbreak;\n\t\tcase 1:\n\t\t\tif (pFileSignerInfo->lpszSubjectEmail != NULL)\n\t\t\t{\n\t\t\t\t_LoadProperty(g_rgPROPERTYMAP[i], pFileSignerInfo->lpszSubjectEmail);\n\t\t\t}\n\t\t\tbreak;\n\t\tcase 2:\n\t\t\tif (pFileSignerInfo->lpszDateTime != NULL)\n\t\t\t{\n\t\t\t\t_LoadProperty(g_rgPROPERTYMAP[i], pFileSignerInfo->lpszDateTime);\n\t\t\t}\n\t\t\tbreak;\n\t\t}\n\t}\n\tCSignDigitalInfo::FreeSafe(pFileSignerInfo);\n}\n"})}),"\n",(0,r.jsx)(e.p,{children:"12.\u4ece\u6587\u4ef6\u8bfb\u8be6\u7ec6\u4fe1\u606f\u5e76\u5199\u5165\u7f13\u5b58"}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",children:'void CSignPropertyHandler::DetailsColumns(LPCWSTR pszFilePath)\n{\n\tVersion_Info *pVerInfo = nullptr;\n\tCFileVersionInfo::Query(pszFilePath, &pVerInfo);\n\tif (pVerInfo != nullptr)\n\t{\n\t\ttry {\n\t\t\tfor (UINT i = 0; i < ARRAYSIZE(g_rgPROPERTYMAP_DETAILS); ++i)\n\t\t\t{\n\t\t\t\tswitch (i)\n\t\t\t\t{\n\t\t\t\tcase 0:\n\t\t\t\t\tif (pVerInfo->lpszComments != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszComments);\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\t\t\t\tcase 1:\n\t\t\t\t\t// \u5ffd\u7565\uff0c\u5426\u5219\u4f1a\u5bfc\u81f4explorer \u91cd\u590d\u5173\u95ed\n\t\t\t\t\t/*if (pVerInfo->lpszInternalName != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszInternalName);\n\t\t\t\t\t}*/\n\t\t\t\t\tbreak;\n\t\t\t\tcase 2:\n\t\t\t\t\tif (pVerInfo->lpszProductName != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszProductName);\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 3:\n\t\t\t\t\tif (pVerInfo->lpszCompanyName != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszCompanyName);\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\t\t\t\tcase 4:\n\t\t\t\t\tif (pVerInfo->lpszLegalCopyright != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszLegalCopyright);\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\t\t\t\tcase 5:\n\t\t\t\t\tif (pVerInfo->lpszProductVersion != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszProductVersion);\n\t\t\t\t\t\t/*\n\t\t\t\t\t\tIPropertyDescription* ppd = NULL;\n\t\t\t\t\t\tHRESULT hr = PSGetPropertyDescriptionByName(L"System.Software.ProductVersion", IID_PPV_ARGS(&ppd));\n\t\t\t\t\t\tif (SUCCEEDED(hr))\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tPROPERTYKEY propKey;\n\t\t\t\t\t\t\thr = ppd->GetPropertyKey(&propKey);\n\t\t\t\t\t\t\tif (SUCCEEDED(hr))\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tPROPERTYMAP propMap;\n\t\t\t\t\t\t\t\tpropMap.pkey = &propKey;\n\t\t\t\t\t\t\t\t_LoadProperty(propMap, pVerInfo->lpszProductVersion);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tppd->Release();\n\t\t\t\t\t\t}//*/\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 6:\n\t\t\t\t\tif (pVerInfo->lpszFileDescription != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszFileDescription);\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\t\t\t\tcase 7:\n\t\t\t\t\t// \u5ffd\u7565\uff0c\u5426\u5219\u4f1a\u5bfc\u81f4explorer \u91cd\u590d\u5173\u95ed\n\t\t\t\t\t/*if (pVerInfo->lpszFileVersion != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszLegalTrademarks);\n\t\t\t\t\t}*/\n\t\t\t\t\tbreak;\n\t\t\t\tcase 8:\n\t\t\t\t\tif (pVerInfo->lpszFileVersion != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszFileVersion);\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\t\t\t\tcase 9:\n\t\t\t\t\tif (pVerInfo->lpszOriginalFilename != NULL)\n\t\t\t\t\t{\n\t\t\t\t\t\t_LoadProperty(g_rgPROPERTYMAP_DETAILS[i], pVerInfo->lpszOriginalFilename);\n\t\t\t\t\t}\n\t\t\t\t\tbreak;\n\t\t\t\tcase 10:\n\t\t\t\t\tbreak;\n\t\t\t\tcase 11:\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tcatch (...) {\n\t\t}\n\t}\n\n\tCFileVersionInfo::FreeSafe(pVerInfo);\n}\n'})}),"\n",(0,r.jsx)(e.p,{children:"13.\u6ce8\u518c:\u5199\u6ce8\u518c\u8868"}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",children:'HRESULT RegisterHandler()\n{\n\t// register the property handler COM object with the system\n\tCRegisterExtension re(__uuidof(CSignPropertyHandler), HKEY_LOCAL_MACHINE);\n\tHRESULT hr = re.RegisterInProcServer(c_szPropertyHandlerDescription, L"Both");\n\tif (SUCCEEDED(hr))\n\t{\n\t\thr = re.RegisterInProcServerAttribute(L"ManualSafeSave", TRUE);\n\t\tif (SUCCEEDED(hr))\n\t\t{\n\t\t\thr = re.RegisterPropertyHandler(c_szExeFileExtension);\n\t\t\thr = re.RegisterPropertyHandler(c_szDllFileExtension);\n\t\t\thr = re.RegisterPropertyHandler(c_szSysFileExtension);\n\t\t\thr = re.RegisterPropertyHandler(c_szMsiFileExtension);\n\t\t}\n\t\t\n\t}\n\n\treturn hr;\n}\n'})}),"\n",(0,r.jsx)(e.p,{children:"14.\u5378\u8f7d:\u4ece\u6ce8\u518c\u8868\u4e2d\u5220\u9664"}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-cpp",children:"HRESULT UnregisterHandler()\n{\n\tCRegisterExtension re(__uuidof(CExePropertyHandler), HKEY_LOCAL_MACHINE);\n\tHRESULT hr = re.RegisterPropertyHandler(c_szExeFileExtension);\n\thr = re.RegisterPropertyHandler(c_szDllFileExtension);\n\thr = re.RegisterPropertyHandler(c_szSysFileExtension);\n\n\tCRegisterExtension reMsi(__uuidof(CMsiPropertyHandler), HKEY_LOCAL_MACHINE);\n\thr = reMsi.RegisterPropertyHandler(c_szMsiFileExtension);\n\treturn hr;\n}\n"})}),"\n",(0,r.jsx)(e.h1,{id:"\u8bfb\u53d6\u6587\u4ef6exedllsys\u7b7e\u540d\u4fe1\u606f",children:"\u8bfb\u53d6\u6587\u4ef6(exe\u3001dll\u3001sys)\u7b7e\u540d\u4fe1\u606f"}),"\n",(0,r.jsxs)(e.p,{children:["\u53c2\u8003",(0,r.jsx)(e.a,{href:"https://blog.csdn.net/earbao/article/details/22384995",children:"\u94fe\u63a5"})]}),"\n",(0,r.jsx)(e.h1,{id:"\u8bfb\u53d6\u6587\u4ef6exedllsys\u8be6\u7ec6\u4fe1\u606f",children:"\u8bfb\u53d6\u6587\u4ef6(exe\u3001dll\u3001sys)\u8be6\u7ec6\u4fe1\u606f"}),"\n",(0,r.jsxs)(e.p,{children:["1.\u53c2\u8003\u94fe\u63a5",(0,r.jsx)(e.a,{href:"https://xmuli.tech/posts/f7b60695/",children:"Demo"}),"\n2.\u53c2\u8003",(0,r.jsx)(e.a,{href:"https://learn.microsoft.com/en-us/windows/win32/api/winver/nf-winver-verqueryvaluea",children:"Api"}),"\n3.\u5148\u8bfb\u53d6 rc \u4e2d\u7684\u8bed\u8a00ID,\u518d\u6839\u636e\u8bed\u8a00ID\u8bfb\u53d6\u8d44\u6e90\u4fe1\u606f\u3002\n4.\u53ef\u4f7f\u7528UltraEdit \u6253\u5f00\u6587\u4ef6\uff0c\u67e5\u770b\u6587\u4ef6\u8be6\u7ec6\u4fe1\u606f\u3002"]})]})}function d(t={}){const{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,r.jsx)(e,{...t,children:(0,r.jsx)(c,{...t})}):c(t)}},8453:(t,e,n)=>{n.d(e,{R:()=>o,x:()=>a});var r=n(6540);const i={},s=r.createContext(i);function o(t){const e=r.useContext(s);return r.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function a(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(i):t.components||i:o(t.components),r.createElement(s.Provider,{value:e},t.children)}}}]);