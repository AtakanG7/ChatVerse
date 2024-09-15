#!/bin/bash

sudo docker build -t emochat -f Dockerfile . --no-cache
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed."
    exit 1
fi

sudo docker tag emochat atakan1927/emochat:latest
if [ $? -ne 0 ]; then
    echo "Error: Docker tag failed."
    exit 1
fi

sudo docker push atakan1927/emochat:latest
if [ $? -ne 0 ]; then
    echo "Error: Docker push failed."
    exit 1
fi

wget -qO- https://api.render.com/deploy/srv-crf56oij1k6c73dhqvb0?key=Cc-ml1X55FI
if [ $? -ne 0 ]; then
    echo "Error: Render deployment trigger failed."
    exit 1
fi

echo "Deployment triggered successfully on Render."