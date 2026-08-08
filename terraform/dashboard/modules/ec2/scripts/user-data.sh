#!/bin/bash
set -e

echo " Updating system "
apt-get update -y
apt-get upgrade -y

echo " Installing dependencies "
apt-get install -y \
    git \
    curl \
    ca-certificates \
    gnupg \
    lsb-release

echo " Installing Docker "

install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
| gpg --dearmor -o /etc/apt/keyrings/docker.gpg

chmod a+r /etc/apt/keyrings/docker.gpg

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
> /etc/apt/sources.list.d/docker.list

apt-get update -y

apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

systemctl enable docker
systemctl start docker

echo "Cloning repository"

mkdir -p /opt

cd /opt

git clone https://github.com/DevDavSS/AWS-MONITOR-PLATFORM.git

cd aws-monitoring-dashboard

