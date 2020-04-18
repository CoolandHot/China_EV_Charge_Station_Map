@echo off
start nginx
tasklist /fi "imagename eq nginx.exe"
pause

REM 如果没启动成功，看logs目录

REM 测试配置文件是否正确
REM nginx -t

REM 快速停止或关闭
REM nginx -s stop
REM 正常停止或关闭nginx
REM nginx -s quit

REM 配置文件nginx.conf修改重装载命令
REM nginx -s reload