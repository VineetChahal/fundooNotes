#!/bin/bash

echo "Stopping mongodb..."
sudo systemctl stop mongodb || { echo "Failed to stop mongodb"; exit 1; }

echo "Stopping RabbitMQ..."
sudo systemctl stop rabbitmq || { echo "Failed to stop RabbitMQ"; exit 1; }

echo "Stopping Redis..."
sudo systemctl stop redis || { echo "Failed to stop Redis"; exit 1; }

echo "All services stopped successfully!"
