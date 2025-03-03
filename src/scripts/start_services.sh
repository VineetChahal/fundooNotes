#!/bin/bash

echo "Starting mongodb..."
sudo systemctl start mongodb || (echo "Failed to start mongodb"; exit 1;)

echo "Starting Redis..."
sudo systemctl start redis || { echo "Failed to start Redis"; exit 1; }

echo "Starting RabbitMQ..."
sudo systemctl start rabbitmq || { echo "Failed to start RabbitMQ"; exit 1; }

echo "All services started successfully!"
