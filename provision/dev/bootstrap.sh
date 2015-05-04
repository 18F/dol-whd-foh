#!/bin/bash

# Get Apache fired up
sudo apt-get update -y
sudo apt-get install apache2 -y

# Install git and such 
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
sudo su vagrant <<'EOF'

# Install Node
curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.profile
source /home/vagrant/.profile
nvm install 0.12
nvm alias default 0.12

cd /vagrant && npm install
npm install -g forever

# Start running
cd /vagrant/src
./make.js
cd /vagrant/api
forever start api.js
EOF

# Create a symlink for apache
sudo rm -rf /var/www/html
sudo ln -s /vagrant/_site /var/www/html

# Create proxy for elasticsearch
sudo a2enmod proxy_http
sudo cp /vagrant/provision/dev/apache.conf /etc/apache2/sites-available/000-default.conf
sudo service apache2 restart