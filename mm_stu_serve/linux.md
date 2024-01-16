# 查看防火墙命令
```shell
systemctl status firewalld
```
# 文件重命名
```shell
mv olefile newfile #将olefile文件重命名为newfile
```
# 查看ip包过滤规则? 没搞明白
```shell
iptables 
[-L] 显示所选链的所有规则。如果没有选择链，所有链将被显示。也可以和z选项一起使用，这时链会被自动列出和归零。精确输出受其它所给参数影响。
```
# 下载文件
```shell
wget url
-o 保存到指定文件
-r 递归下载
-b 后台下载

tar 解压
tar 命令用于对文件进行打包和解包操作，常用于在Unix和Linux系统中。xvzf 是 tar 命令的一组选项，用于解包一个经过 gzip 压缩的 tar 归档文件。

具体选项的含义如下：

    x: 表示解包（extract）。
    v: 表示详细输出，显示解包过程中的文件名。
    z: 表示使用 gzip 解压缩。
    f: 后面紧跟的是要解包的文件名。
tar -xzvf file.tar.gz
```


# 创建 docker 卷
```shell
docker volume create volname #该命令会在 /var/lib/docker/volumes/  创建一个 volname 目录 
docker volume inspect volname #查看卷名称的状态

# 运行容器
-p local_port:images_port #指定端口映射*
-v local_dir:images_dir # 容器卷挂载
-d 后台运行
-e 设置环境变量
--name 指定容器名称
docker run

mysql 数据存放目录 /var/lib/mysql
mysql 配置文件 /etc/mysql/conf.d
docker 初次进入 mysql 容器时需要修改密码
#ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '你的密码';
```

# 进入容器
```shell
docker exec [option]
-i
```

# 查看npm 镜像源
```shell
npm config get registry
npm config set registry https://registry.npm.taobao.org
npm config set registry https://registry.npmjs.org
```

# windows 远程传输文件
```shell
scp -v -r 文件夹名 远程用户名@弹性ip：目录名
-v查看传输过程，-r递归传输 -C压缩传输后再传输完成后解压
```

# 运行nestjs项目
```shell
nohup ts-node -r tsconfig-paths/register src/main.ts &

#docker 部署nginx
docker run -p 80:80 \
-v /etc/node/bi-shu/web/:/etc/nginx/web \
-v /etc/node/bi-shu/web/ngxin.conf:/etc/nginx/nginx.conf \
-d a6bd71f48f68

#docker 部署mysql
docker run -p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=123456 \
-v /etc/mysql/conf.d/:/etc/mysql/conf.d \
-v /etc/mysql/data/:/var/lib/mysql \
-d  f7fdab215ab7
```