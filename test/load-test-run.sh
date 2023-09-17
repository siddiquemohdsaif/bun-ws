#!/bin/bash

# Start the monitoring script in the background
./monitor_resources.sh &

# Save the PID of the monitoring script for later use
MONITOR_PID=$!

# Run the Artillery load test
artillery run config.yml

# Once the load test is done, kill the monitoring script
kill $MONITOR_PID
