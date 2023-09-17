#!/bin/bash

# File to store the results
output_file="resource_usage.csv"

# Write the header of the CSV
echo "timestamp,cpu_usage(%),free_ram(mb),total_ram(mb)" > $output_file

# Monitor every second
interval=1

# Duration of the test in seconds (e.g., 120 seconds for 2 minutes)
duration=320

end_time=$(($(date +%s) + duration))

while [ $(date +%s) -lt $end_time ]; do
    # Capture the timestamp
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")

    # Get CPU usage: We use vmstat and get the idle CPU from the output then subtract from 100 to get the usage.
    # This gives the average CPU usage since the last call to vmstat. The first call to vmstat will give the average since boot.
    cpu_idle=$(vmstat 1 2 | tail -1 | awk '{print $15}')
    cpu_usage=$((100 - cpu_idle))

    # Get RAM usage: We use free to get the memory details.
    ram=$(free -m | grep Mem)
    total_ram=$(echo $ram | awk '{print $2}')
    free_ram=$(echo $ram | awk '{print $4}')

    # Write the captured metrics to the CSV
    echo "$timestamp,$cpu_usage,$free_ram,$total_ram" >> $output_file

    sleep $interval
done
