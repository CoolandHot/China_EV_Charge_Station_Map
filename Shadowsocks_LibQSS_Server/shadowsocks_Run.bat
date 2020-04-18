@echo off
Echo 安全组设置  Source/port---any/* ; Destination/port---any/38381
Echo 防火墙 添加 shadowsocks-libqss_2.0.2.exe
Echo.
Echo.
shadowsocks-libqss_2.0.2.exe -c config.json -S

