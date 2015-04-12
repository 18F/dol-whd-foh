#!/usr/bin/env bash

# Get NGINX fired up
sudo apt-add-repository ppa:nginx/stable -y
sudo apt-get update -y
sudo apt-get install -y nginx
sudo cp /vagrant/provision/dev/nginx.conf /etc/nginx/sites-enabled/default
sudo service nginx restart

# Get Jekyll installed
sudo apt-get install ruby1.9.1-dev -y
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs -y
gem install jekyll

sudo apt-get install git -y

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

