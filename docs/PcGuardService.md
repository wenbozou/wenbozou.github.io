---
sidebar_label: 'PcGuardService'
sidebar_position: 4
---


# PcGuardService

## 简介
    PcGuardService是一款基于Windows系统的自动化任务守护服务进程，它对接服务后端、自动化环境部署工具、自动化工具。


## 创建服务
    C# Windows服务[教程](https://learn.microsoft.com/en-us/dotnet/framework/windows-services/how-to-create-windows-services)
    示例代码[Demo](https://github.com/microsoft/Windows-classic-samples/tree/master/Samples/Win7Samples/winsvc/PcgGuardService)

## 自托管服务器
    从 nuget 获取 Microsoft.AspNet.WebApi.SelfHost 包，并使用它来编写 Web API 服务。
    返回值中的Json数据序列化，请使用ApiController的Json方法。

### 1.定义TaskController类，从基类ApiController派生,并实现两个接口：create和state。
```cs title="subclass TaskController"
    public class public class TaskController : ApiController
    {

        /// <summary>
        /// Post api/task/create
        /// </summary>
        [HttpPost]
        public IHttpActionResult create([FromBody]ReceiveData receiveData)
        {
            ReturnData rd = new ReturnData();
            //...
            return Json(rd);
        }

        /// <summary>
        /// Get api/task/state
        /// </summary>
        [HttpGet]
        public IHttpActionResult state([FromUri]int subTaskId)
        {
            ReturnData rd = new ReturnData();
            ///...
            return Json(rd);
        }
    }
```
    
### 2.初始化webapi服务
```cs title=""
    public static class SelfHostedWebApiConfig
    {
        private static AutoResetEvent _autoResetEvent = new AutoResetEvent(false);
        public static void Init()
        {
            try {
                string url = "";
                string ipAddress = $"http://{url}:18080";
                // 设置自托管服务器的地址
                var config = new HttpSelfHostConfiguration(ipAddress); ///"http://localhost:18080"

                // 配置默认路由
                config.Routes.MapHttpRoute(
                        name: "DefaultApi",
                        routeTemplate: "api/{controller}/{action}/{id}",
                        defaults: new { id = RouteParameter.Optional}
                    );

                // 创建并启动自托管服务器
                using (HttpSelfHostServer server = new HttpSelfHostServer(config))
                {
                    server.OpenAsync().Wait();
                    _autoResetEvent.WaitOne();
                }
            }
            catch (Exception ex)
            {
            }
        }
    }
```


### 3.启动服务
```cs 
_ = Task.Factory.StartNew(()=> { SelfHostedWebApiConfig.Init(); });
```

## 向后端服务注册本机信息
```cs
private static readonly string _registerUri = "http://192.168.50.48:8096/machine/device/register";
string postData = JsonConvert.SerializeObject(di, Formatting.None);
Dictionary<string, string> requestHeader = new Dictionary<string, string>();
requestHeader.Add("Content-Type", "application/json");
var result = LibcurlCLR.LibcurlHelper.Post(_registerUri, postData, requestHeader, 60000, 60000);
```

## Ftp 下载文件
```cs
public bool Download(string ftpUri, string localFilePath)
{
    bool bResult = false;
    FtpWebRequest request = (FtpWebRequest)WebRequest.Create(ftpUri);
    request.Method = WebRequestMethods.Ftp.DownloadFile;

    // 设置仅用户名的凭据
    request.Credentials = new NetworkCredential(_userName, _password);

    try
    {
        using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
        using (System.IO.Stream responseStream = response.GetResponseStream())
        using (System.IO.FileStream fileStream = new System.IO.FileStream(localFilePath, System.IO.FileMode.Create))
        {
            responseStream.CopyTo(fileStream);
            bResult = response.StatusCode == FtpStatusCode.ClosingData ? true : false; 
        }
    }
    catch (Exception ex)
    {
    }

    return bResult;
}        
```

## 安装过程中不覆盖已存在的location.json配置文件
    1.开始升级时拷贝已存在的location.json到临时目录;
    2.安装完成后再将临时目录下的location.json拷贝到安装目录;
    3.删除临时目录。
```
procedure CurStepChanged(CurStep: TSetupStep);
 var 
 FailIfExists: Boolean;
	begin
		if CurStep = ssInstall then
		begin
			FileCopy(ExpandConstant('{app}\\Config\\location.json'), ExpandConstant('{localappdata}\\location.json'), FailIfExists);
		end;
	end;

procedure CurInstallProgressChanged(CurProgress, MaxProgress: Integer);
var 
 FailIfExists: Boolean;
begin
	if CurProgress = MaxProgress then
	begin
	FileCopy(ExpandConstant('{localappdata}\\location.json'), ExpandConstant('{app}\\Config\\location.json'), FailIfExists);
	end;
end;
```


## 静默安装程序包


```cs 用 Cmd 执行 "/VERYSILENT /SP- /NORESTART /DIR=\"{installTargetDir}\" /LANG=en /LOG=\"{logName}\" /sptrack " 即可。
string installTargetDir = $"{programFilesX86Path}\\{folderName}\\";
string logName = $"{System.AppDomain.CurrentDomain.BaseDirectory}Logs\\setup.log";
string curlParam = $"/VERYSILENT /SP- /NORESTART /DIR=\"{installTargetDir}\" /LANG=en /LOG=\"{logName}\" /sptrack ";

ProcessStartInfo startInfo = new ProcessStartInfo
{
    FileName = $"cmd.exe", // 指定要启动的外部程序名称  
    Arguments = $"/c \"\"{packagePath}\" {curlParam}\"", // 启动时传递给程序的参数
    UseShellExecute = false,       // 不使用系统 shell 执行
    CreateNoWindow = true,         // 不显示 cmd 窗口
    WorkingDirectory = AppDomain.CurrentDomain.BaseDirectory,
};

// 创建并启动进程  
using (Process curlProc = Process.Start(startInfo))
{
    if (curlProc != null)
    {
        curlProc.WaitForExit();
    }
    else {}
}
```

## log4net 日志记录
1.引用 log4net 程序集
2.创建日志配置文件 log4net.config
```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <configSections>
    <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net" />
  </configSections>
  <log4net>
    <!-- 定义一个文件日志记录器 -->
    <appender name="RollingFileAppender" type="log4net.Appender.RollingFileAppender">
      <!-- 日志文件的路径 -->
      <file value="logs\" />
      <rollingStyle value="Date" />
      <!-- 文件格式-->
      <!-- 文件日志的回滚机制 -->
      <appendToFile value="true" />
      <!-- 日志文件的最大大小 -->
      <maximumFileSize value="10MB" />
      <!-- 保留的日志文件个数 -->
      <maxSizeRollBackups value="5" />
      <!--否采用静态文件名，文件名是否唯一-->
      <staticLogFileName value="false"/>
      <!-- 日志格式 -->
      <layout type="log4net.Layout.PatternLayout">
        <conversionPattern value="%date %-5level %logger - %message%newline" />
      </layout>
    </appender>

    <!-- 定义一个控制台日志记录器 -->
    <appender name="ConsoleAppender" type="log4net.Appender.ConsoleAppender">
      <layout type="log4net.Layout.PatternLayout">
        <conversionPattern value="%date %-5level %logger - %message%newline" />
      </layout>
    </appender>

    <!-- 定义日志级别及适用的appender -->
    <root>
      <!-- 日志级别：DEBUG, INFO, WARN, ERROR, FATAL -->
      <level value="DEBUG" />
      <level value="INFO" />
      <!-- 关联控制台和文件的日志输出 -->
      <appender-ref ref="ConsoleAppender" />
      <appender-ref ref="RollingFileAppender" />
    </root>
  </log4net>
</configuration>
```
3.在应用程序入口处添加以下代码
```cs
XmlConfigurator.Configure();
```
4.在需要记录日志的代码中，通过 log4net 记录日志
```cs
ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
log.Info("This is a log message.");


