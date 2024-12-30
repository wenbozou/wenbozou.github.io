---
sidebar_label: 'ssh:connect to host github.com port 22: Connection timed out'
sidebar_position: 1
---

# 问题: ssh:connect to host github.com port 22: Connection timed out

# 解决方法
方法1：如果22号端口不行，换一个端口

1.创建一个config文件, 编辑文件内容如下：

```
Host github.com
User git
Hostname ssh.github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
Port 443

Host gitlab.com
Hostname altssh.gitlab.com
User git
Port 443
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
```

2.保存文件，并将文件路径添加到ssh的配置文件中，一般为："C:\Users\wenbo\.ssh"

3.检查是否成功
```
ssh -T git@github.com
```

如果成功，会出现：

```
Hi wenbozou! You've successfully authenticated, but GitHub does not provide shell access.
```