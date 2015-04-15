#!/usr/bin/env bash

# Get NGINX fired up
sudo apt-add-repository ppa:nginx/stable -y
sudo apt-get update -y
sudo apt-get install -y nginx
sudo cp /vagrant/provision/dev/nginx.conf /etc/nginx/sites-enabled/default
sudo service nginx restart

# Install node
curl -sL https://deb.nodesource.com/setup | sudo bash -
gem install jekyll

# Install Node 0.12
curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
nvm install 0.12

sudo apt-get install git -y
sudo apt-get install build-essential g++ -y

# Install httpie
sudo apt-get install -y python-pip
sudo pip install httpie

# Install Elasticsearch
# Adapted from https://gist.github.com/ricardo-rossi/8265589463915837429d
sudo apt-get install openjdk-7-jre-headless -y
wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.5.0.deb
sudo dpkg -i elasticsearch-1.5.0.deb
rm elasticsearch-1.5.0.deb
curl -L http://github.com/elasticsearch/elasticsearch-servicewrapper/tarball/master | tar -xz
sudo mkdir /usr/local/share/elasticsearch
sudo mkdir /usr/local/share/elasticsearch/bin
sudo mv *servicewrapper*/service /usr/local/share/elasticsearch/bin/
rm -Rf *servicewrapper*
sudo /usr/local/share/elasticsearch/bin/service/elasticsearch install
sudo ln -s `readlink -f /usr/local/share/elasticsearch/bin/service/elasticsearch` /usr/local/bin/rcelasticsearch
sudo service elasticsearch start

# Install Pandoc
wget https://github.com/jgm/pandoc/releases/download/1.13.2/pandoc-1.13.2-1-amd64.deb
sudo dpkg -i pandoc-1.13.2-1-amd64.deb

# Install NPM dependencies
cd /vagrant && npm install
